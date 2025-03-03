import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { STAFF_SCHEMA } from './schema';
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
    
    
    
    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "developer",
          content: SYSTEM_INSTRUCTIONS + " Return the result as JSON."
        },
        {
          role: "user",
          content: `Parse this extracted excel information and return the exact schema as JSON: ${JSON.stringify(data.excelData, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "StaffSchema",
          schema: STAFF_SCHEMA
        }
      },
      reasoning_effort: "medium"
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Failed to get valid response from OpenAI');
    }
    
    
    
    
    return NextResponse.json({ 
      data: JSON.parse(content),
      message: 'Staff data processed successfully'
    });
    
  } catch (error: any) {
    console.error('Error processing staff data:', error);
    return NextResponse.json(
      { message: error.message || 'Error processing data' },
      { status: 500 }
    );
  }
}