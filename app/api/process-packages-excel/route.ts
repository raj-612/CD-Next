import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { PACKAGES_SCHEMA } from './schema';
import { SYSTEM_INSTRUCTIONS } from './prompts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    
    
    
    const data = await req.json();
    
    if (!data || (!data.discountData && !data.packageData)) {
      
      return NextResponse.json({ message: 'No Excel data provided' }, { status: 400 });
    }
    
    
    
    const requestData = {
      discountSheet: data.discountData || [],
      packageSheet: data.packageData || []
    };
    
    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "developer",
          content: SYSTEM_INSTRUCTIONS + " Return the result as JSON."
        },
        {
          role: "user",
          content: `Parse these extracted excel sheets and return the exact schema as JSON: ${JSON.stringify(requestData, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "PackagesSchema",
          schema: PACKAGES_SCHEMA
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
      message: 'Packages and discounts data processed successfully'
    });
    
  } catch (error: any) {
    console.error('Error processing packages data:', error);
    return NextResponse.json(
      { message: error.message || 'Error processing data' },
      { status: 500 }
    );
  }
}