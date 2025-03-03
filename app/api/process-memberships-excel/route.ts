import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { MEMBERSHIPS_SCHEMA } from './schema';
import { SYSTEM_INSTRUCTIONS } from './prompts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    
    
    
    const data = await req.json();
    
    if (!data || !data.excelData) {
      
      return NextResponse.json({ message: 'No Excel data provided' }, { status: 400 });
    }
    
    const excelData = data.excelData;
    
    
    
    if (excelData.length > 0) {
      
      if (excelData.length > 1) {
        
      }
    }
    
    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "developer",
          content: SYSTEM_INSTRUCTIONS + " Return the result as JSON."
        },
        {
          role: "user",
          content: `Parse this extracted excel information and return the exact schema as JSON. 
          The first row typically contains headers and the rest are data rows.
          Make sure to properly extract all memberships from the data:
          ${JSON.stringify(excelData, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "MembershipsSchema",
          schema: MEMBERSHIPS_SCHEMA
        }
      },
      reasoning_effort: "high"
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Failed to get valid response from OpenAI');
    }
    
    
    const parsedContent = JSON.parse(content);
    
    
    
    return NextResponse.json({ 
      data: parsedContent,
      message: 'Memberships data processed successfully'
    });
    
  } catch (error: any) {
    console.error('Error processing memberships data:', error);
    return NextResponse.json(
      { message: error.message || 'Error processing data' },
      { status: 500 }
    );
  }
}