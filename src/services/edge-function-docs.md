
# Supabase Edge Function: sync-mos-to-sheets

This document describes the implementation of the `sync-mos-to-sheets` Edge Function that needs to be created in your Supabase project.

## Overview

The Edge Function syncs MOS data from Supabase to Google Sheets, organizing items by store location in separate tabs.

## Implementation Steps

1. Create a new Edge Function in your Supabase dashboard called `sync-mos-to-sheets`
2. Set up the following secrets in your Supabase project:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: The service account email for Google Sheets API
   - `GOOGLE_PRIVATE_KEY`: The private key for the service account

3. Use the following code as a template for your Edge Function:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleSpreadsheet } from 'https://esm.sh/google-spreadsheet@3.3.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface MOSItem {
  id: string
  code: string
  quantity: number
  reason: string
  timestamp: string
  store_location: string
}

serve(async (req) => {
  try {
    // Get the sheet URL from the request
    const { sheetUrl } = await req.json()
    
    // Extract spreadsheet ID from URL
    const matches = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (!matches || !matches[1]) {
      return new Response(
        JSON.stringify({ error: 'Invalid Google Sheet URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const spreadsheetId = matches[1]
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Fetch MOS items from database
    const { data: mosItems, error } = await supabase
      .from('mos_items')
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    
    // Group items by store location
    const itemsByLocation = {}
    mosItems.forEach((item: MOSItem) => {
      const location = item.store_location || 'Unknown'
      if (!itemsByLocation[location]) {
        itemsByLocation[location] = []
      }
      itemsByLocation[location].push(item)
    })
    
    // Initialize Google Sheets
    const doc = new GoogleSpreadsheet(spreadsheetId)
    
    // Authenticate with Google
    await doc.useServiceAccountAuth({
      client_email: Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') || '',
      private_key: Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n') || '',
    })
    
    await doc.loadInfo()
    
    // Process each store location
    for (const location in itemsByLocation) {
      const items = itemsByLocation[location]
      
      // Find or create tab for this location
      let sheet = doc.sheetsByTitle[location]
      if (!sheet) {
        sheet = await doc.addSheet({ title: location })
      }
      
      // Clear existing data except headers
      await sheet.clear()
      
      // Add headers
      await sheet.setHeaderRow(['Code', 'Quantity', 'Reason', 'Timestamp'])
      
      // Add data
      const rows = items.map((item: MOSItem) => ({
        Code: item.code,
        Quantity: item.quantity,
        Reason: item.reason,
        Timestamp: new Date(item.timestamp).toLocaleString(),
      }))
      
      if (rows.length > 0) {
        await sheet.addRows(rows)
      }
    }
    
    // Create or update a summary sheet
    let summarySheet = doc.sheetsByTitle['Summary']
    if (!summarySheet) {
      summarySheet = await doc.addSheet({ title: 'Summary' })
    }
    
    await summarySheet.clear()
    await summarySheet.setHeaderRow(['Store Location', 'Total Items', 'Last Updated'])
    
    const summaryRows = Object.keys(itemsByLocation).map(location => ({
      'Store Location': location,
      'Total Items': itemsByLocation[location].length,
      'Last Updated': new Date().toLocaleString()
    }))
    
    await summarySheet.addRows(summaryRows)
    
    return new Response(
      JSON.stringify({ 
        message: 'Successfully synced data to Google Sheets',
        locations: Object.keys(itemsByLocation),
        totalItems: mosItems.length
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

## Required Google Setup

1. Create a Google Service Account:
   - Go to the Google Cloud Console
   - Create a new project or use an existing one
   - Enable the Google Sheets API
   - Create a service account
   - Generate a private key (JSON format)
   - Share your Google Sheet with the service account email (with Editor permission)

2. Add the necessary environment variables to your Supabase project from the service account JSON file.

## Required Supabase Setup

1. Create the `mos_items` table with the following columns:
   - `id` (text, primary key)
   - `code` (text)
   - `quantity` (integer)
   - `reason` (text)
   - `timestamp` (timestamptz)
   - `store_location` (text)

2. Create the `mos_config` table with the following columns:
   - `id` (text, primary key)
   - `sheet_url` (text)
   - `last_synced` (timestamptz)

3. Set up Row Level Security (RLS) policies appropriate for your application.
