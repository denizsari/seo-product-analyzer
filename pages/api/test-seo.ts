import { NextApiRequest, NextApiResponse } from 'next';

// Mock data that matches the expected n8n workflow output format
const mockSEOData = {
  timestamp: new Date().toISOString(),
  status: 'success',
  data: {
    seo_meta: {
      title: 'Advanced Project Management Software - Boost Team Productivity',
      description: 'Streamline your workflow with our comprehensive project management tool. Features task tracking, collaboration, and reporting. Start your free trial today!',
      keywords: 'project management, task tracking, team collaboration, productivity software, workflow management, project planning'
    },
    product_content: {
      product_title: 'Advanced Project Management Software - Boost Team Productivity',
      product_description: 'Transform your team\'s productivity with our comprehensive project management software designed for modern businesses. Our intuitive platform combines powerful task tracking, seamless team collaboration, and advanced reporting capabilities to help you deliver projects on time and within budget. Key features include customizable workflows, real-time progress monitoring, file sharing, time tracking, and integrated communication tools. Whether you\'re managing a small team or coordinating complex enterprise projects, our software adapts to your needs with flexible project templates, automated notifications, and detailed analytics. Experience improved team coordination, reduced project delays, and enhanced visibility across all your initiatives. Join thousands of successful teams who have streamlined their project management process and achieved better results with our award-winning platform.'
    }
  },
  original_request: {
    product: 'Project Management Software'
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, requestId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock data with the requested title
    const responseData = {
      ...mockSEOData,
      original_request: {
        product: title,
        requestId: requestId || `mock_${Date.now()}`
      }
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in test SEO endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to process test SEO request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}