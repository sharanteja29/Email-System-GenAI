import React, { useState } from 'react';
import { Send, Mail, MessageCircle, Search, Loader2, CheckCircle, AlertCircle, Brain, Bot, Users, Shield, BarChart3, Settings, Plug } from 'lucide-react';
import { Clipboard } from 'lucide-react';

type Endpoint = 'home' | 'router' | 'query';
const AZURE_BASE_URL = "https://emailagentai-dgdgcyd2h4fmhcc3.centralus-01.azurewebsites.net"; 
interface FormData {
  sender: string;
  subject: string;
  body: string;
  user_query: string;
}

interface ApiResponse {
  end_point: string;
  sender?: string;
  subject?: string;
  body?: string;
  sentiment?: string;
  explanation?: string;
  user_query?: string;
  query_response?: string;
  analysis?: {
    intent?: string;
    sentiment?: string;
    urgency?: string;
    entities?: string[];
    context?: string[];
  };
}

function App() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>('home');
  const [formData, setFormData] = useState<FormData>({
    sender: '',
    subject: '',
    body: '',
    user_query: ''
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoints = [
    {
      id: 'home' as Endpoint,
      label: 'Email Response',
      description: 'Generate AI-powered email responses with intelligent context understanding',
      icon: Mail,
      gradient: 'linear-gradient(135deg, #4a6bff 0%, #6c45e4 100%)',
      bgColor: '#f8f9ff',
      borderColor: '#4a6bff'
    },
    {
      id: 'router' as Endpoint,
      label: 'Sentiment Analysis',
      description: 'Analyze email sentiment, mood, and emotional context with AI precision',
      icon: Brain,
      gradient: 'linear-gradient(135deg, #6c45e4 0%, #8b5cf6 100%)',
      bgColor: '#faf8ff',
      borderColor: '#6c45e4'
    },
    {
      id: 'query' as Endpoint,
      label: 'General Query',
      description: 'Ask questions and get intelligent AI responses for any topic',
      icon: Bot,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      bgColor: '#f0fdf4',
      borderColor: '#10b981'
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // ...existing code...
const DEMO_RESPONSES: Record<Endpoint, ApiResponse> = {
  home: {
    end_point: "home",
    sender: "sarah.johnson@example.com",
    subject: "Order #12345 - Missing item in my delivery",
    body: `Hi Sarah,

Thank you for reaching out about your incomplete order #12345. I'm sorry to hear that your Premium Wireless Headphones (SKU: WH-2000) were missing from your delivery.

I've verified your order in our system and can confirm that these headphones were indeed part of your purchase. I'll immediately arrange for the missing item to be shipped to you with expedited delivery at no extra cost.

You should receive a shipping confirmation email within the next 24 hours. As a token of our apology for this inconvenience, I've also added a 10% discount to your account for your next purchase.

Is there anything else you need help with regarding your order?

Best regards,
[Agent Name]
Customer Support Team`,
    analysis: {
      intent: "Report Missing Item (98% confidence)",
      sentiment: "Neutral with slight frustration (94% confidence)",
      urgency: "Medium (96% confidence)",
      entities: ["Order #12345", "Premium Wireless Headphones", "SKU: WH-2000"],
      context: [
        "Order verified in system",
        "Repeat customer, 5 previous orders",
        "No previous issues reported"
      ]
    }
  },
  router: {
    end_point: "router",
    sender: "sarah.johnson@example.com",
    sentiment: "Neutral with slight frustration (94% confidence)",
    explanation: "The customer is polite but expresses concern about a missing item, indicating slight frustration.",
    analysis: {
      intent: "Report Missing Item (98% confidence)",
      sentiment: "Neutral with slight frustration (94% confidence)",
      urgency: "Medium (96% confidence)",
      entities: ["Order #12345", "Premium Wireless Headphones", "SKU: WH-2000"],
      context: [
        "Order verified in system",
        "Repeat customer, 5 previous orders",
        "No previous issues reported"
      ]
    }
  },
  query: {
    end_point: "query",
    user_query: "What is your return policy?",
    query_response: "Our return policy allows you to return most items within 30 days of delivery for a full refund. Please ensure the items are in their original condition and packaging. For more details, visit our Returns & Refunds page."
  }
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setResponse(null);

  try {
    let payload;
    let url = "";

    if (selectedEndpoint === "query") {
      payload = { user_query: formData.user_query };
      url = `${AZURE_BASE_URL}/query`;
    } else if (selectedEndpoint === "router") {
      payload = {
        sender: formData.sender,
        subject: formData.subject,
        body: formData.body
      };
      url = `${AZURE_BASE_URL}/router`;
    } else {
      payload = {
        sender: formData.sender,
        subject: formData.subject,
        body: formData.body
      };
      url = `${AZURE_BASE_URL}/home`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    setResponse(data);
  } catch (err) {
      // Show demo if API fails
       setError("Failed to process request. Showing demo response.");
      setResponse(DEMO_RESPONSES[selectedEndpoint]);
  } finally {
    setLoading(false);
  }
};
  

  const renderFormFields = () => {
    if (selectedEndpoint === 'query') {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="user_query\" className="block text-sm font-semibold text-gray-700 mb-3">
              Your Query
            </label>
            <textarea
              id="user_query"
              value={formData.user_query}
              onChange={(e) => handleInputChange('user_query', e.target.value)}
              placeholder="Ask your question here..."
              className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700 bg-white shadow-sm"
              rows={4}
              required
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="sender" className="block text-sm font-semibold text-gray-700 mb-3">
            Sender Email
          </label>
          <input
            type="email"
            id="sender"
            value={formData.sender}
            onChange={(e) => handleInputChange('sender', e.target.value)}
            placeholder="sender@example.com"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Email subject line"
            className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="body" className="block text-sm font-semibold text-gray-700 mb-3">
            Email Body
          </label>
          <textarea
            id="body"
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Enter the email content here..."
            className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700 bg-white shadow-sm"
            rows={6}
            required
          />
        </div>
      </div>
    );
  };

  const renderResponse = () => {
    if (!response) return null;


    const getResponseStyles = () => {
  switch (response.end_point) {
    case 'home': return { bg: '#f8f9ff', border: '#4a6bff', header: '#22c55e' }; // green-500
    case 'router': return { bg: '#faf8ff', border: '#6c45e4', header: '#22c55e' }; // green-500
    case 'query': return { bg: '#f0fdf4', border: '#10b981', header: '#22c55e' }; // green-500
    default: return { bg: '#f9fafb', border: '#6b7280', header: '#22c55e' }; // green-500
  }
};

    const styles = getResponseStyles();

    return (
      <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <div 
          className="px-6 py-4 text-white font-semibold flex items-center justify-between"
          style={{ background: styles.header }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span>AI Generated Response</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Confidence: 95%</span>
            <div className="w-20 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
              <div className="w-full h-full bg-white" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {response.end_point === 'home' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-600">To:</span>
                  <p className="text-gray-800 mt-1">{response.sender}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">Subject:</span>
                  <p className="text-gray-800 font-medium mt-1">{response.subject}</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 block mb-3">Generated Response:</span>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{response.body}</p>
                </div>
              </div>
            </>
          )}
          
          {response.analysis && (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
    <div className="px-4 py-3 text-white font-semibold" style={{ background: '#6c45e4' }}>
      AI Analysis
    </div>
    <div className="p-4 space-y-3">
      {response.analysis.intent && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-1">Intent:</div>
          <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{response.analysis.intent}</div>
        </div>
      )}
      {response.analysis.sentiment && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-1">Sentiment:</div>
          <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{response.analysis.sentiment}</div>
        </div>
      )}
      {response.analysis.urgency && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-1">Urgency:</div>
          <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{response.analysis.urgency}</div>
        </div>
      )}
      {response.analysis.entities && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-1">Entities Detected:</div>
          <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">
            <ul className="list-disc list-inside space-y-1">
              {response.analysis.entities.map((entity: string, idx: number) => (
                <li key={idx}>{entity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {response.analysis.context && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-1">Customer Context:</div>
          <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">
            <ul className="list-disc list-inside space-y-1">
              {response.analysis.context.map((ctx: string, idx: number) => (
                <li key={idx}>{ctx}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </div>
)}
          {response.end_point === 'router' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-600">From:</span>
                  <p className="text-gray-800 mt-1">{response.sender}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">Detected Sentiment:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-1">
                    {response.sentiment}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600 block mb-3">Analysis Explanation:</span>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-800 leading-relaxed">{response.explanation}</p>
                </div>
              </div>
            </>
          )}
          
         {response.end_point === 'query' && (
  <div>
    <span className="text-sm font-semibold text-gray-600 block mb-3">AI Response:</span>
    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
      <p className="text-gray-800 leading-relaxed">{response.query_response}</p>
    </div>
  </div>
)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="container mx-auto px-5 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8 p-8 text-white rounded-lg" style={{ background: 'linear-gradient(135deg, #4a6bff 0%, #6c45e4 100%)' }}>
          <h1 className="text-4xl font-bold mb-3">NeuronsCX</h1>
          <p className="text-lg opacity-90">Intelligent Agentic AI Platform for Customer Experience Management</p>
        </header>

        {/* Platform Overview */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2" style={{ color: '#4a6bff', borderColor: '#4a6bff' }}>
            Platform Overview
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            NeuronsCX is an advanced AI-powered customer experience platform that processes and responds to customer communications across multiple channels. Using agentic AI, the system can operate in two modes: with human supervision or completely autonomously.
          </p>

          {/* Channels */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { name: 'Email', count: '425 messages', color: '#4a6bff', icon: '✉' },
              { name: 'WhatsApp', count: '352 messages', color: '#25D366', icon: 'W' },
              { name: 'Instagram', count: '189 messages', color: '#C13584', icon: 'I' },
              { name: 'Twitter', count: '145 messages', color: '#1DA1F2', icon: 'T' },
              { name: 'SMS', count: '147 messages', color: '#FF9800', icon: 'S' }
            ].map((channel, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold"
                  style={{ backgroundColor: channel.color }}
                >
                  {channel.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{channel.name}</h3>
                <p className="text-sm text-gray-600">{channel.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operation Modes */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2" style={{ color: '#4a6bff', borderColor: '#4a6bff' }}>
            Operation Modes
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            NeuronsCX can operate in two distinct modes depending on your business needs and preferences.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Human-in-the-Loop Mode */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 text-white font-semibold" style={{ background: '#4a6bff' }}>
                Human-in-the-Loop Mode
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  In this mode, AI processes and analyzes customer messages, then generates response drafts that human agents can review and edit before sending.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Receive Message', desc: 'System receives customer message from any channel' },
                    { title: 'AI Analysis', desc: 'AI analyzes intent, sentiment, entities, and context' },
                    { title: 'Draft Response', desc: 'AI generates appropriate response draft' },
                    { title: 'Human Review', desc: 'Human agent reviews and edits response as needed' },
                    { title: 'Send Response', desc: 'Approved response is sent to customer' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Autonomous Mode */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 text-white font-semibold" style={{ background: '#4a6bff' }}>
                Autonomous Mode
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  In this mode, the AI handles the entire process from receiving messages to sending responses without human intervention, maintaining high accuracy with self-verification.
                </p>
                <div className="space-y-4">
                  {[
                    { title: 'Receive Message', desc: 'System receives customer message from any channel' },
                    { title: 'Deep AI Analysis', desc: 'AI performs comprehensive analysis with high confidence scoring' },
                    { title: 'Self-Check', desc: 'AI verifies accuracy of analysis and response' },
                    { title: 'Auto-Send', desc: 'Response automatically sent if confidence threshold met' },
                    { title: 'Monitoring', desc: 'Continuous quality control and performance tracking' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Processing Flow */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2" style={{ color: '#4a6bff', borderColor: '#4a6bff' }}>
            Example Processing Flow
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            This example shows how NeuronsCX processes a customer email about a missing item in an order.
          </p>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Customer Message */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                Customer Message
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    ✉
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">Sarah Johnson</div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Subject:</strong> Order #12345 - Missing item in my delivery
                    </p>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      Hello,<br/><br/>
                      I received my order #12345 today, but one of the items is missing from the package. I ordered the Premium Wireless Headphones (SKU: WH-2000) which were shown as included on my order confirmation, but they weren't in the box I received.<br/><br/>
                      Could you please help me resolve this issue? I've attached a copy of my order confirmation for reference.<br/><br/>
                      Thank you,<br/>
                      Sarah Johnson
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 text-white font-semibold" style={{ background: '#6c45e4' }}>
                AI Analysis
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: 'Intent:', value: 'Report Missing Item (98% confidence)' },
                  { label: 'Sentiment:', value: 'Neutral with slight frustration (94% confidence)' },
                  { label: 'Urgency:', value: 'Medium (96% confidence)' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="font-semibold text-gray-700 text-sm mb-1">{item.label}</div>
                    <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{item.value}</div>
                  </div>
                ))}
                <div>
                  <div className="font-semibold text-gray-700 text-sm mb-1">Entities Detected:</div>
                  <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Order #12345</li>
                      <li>Premium Wireless Headphones</li>
                      <li>SKU: WH-2000</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 text-sm mb-1">Customer Context:</div>
                  <div className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Order verified in system</li>
                      <li>Repeat customer, 5 previous orders</li>
                      <li>No previous issues reported</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Response */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 text-white font-semibold flex items-center justify-between" style={{ background: '#28a745' }}>
              <span>AI Generated Response</span>
              <div className="flex items-center gap-2 text-sm">
                <span>Confidence: 95%</span>
                <div className="w-20 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-white" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
Hi Sarah,

Thank you for reaching out about your incomplete order #12345. I'm sorry to hear that your Premium Wireless Headphones (SKU: WH-2000) were missing from your delivery.

I've verified your order in our system and can confirm that these headphones were indeed part of your purchase. I'll immediately arrange for the missing item to be shipped to you with expedited delivery at no extra cost.

You should receive a shipping confirmation email within the next 24 hours. As a token of our apology for this inconvenience, I've also added a 10% discount to your account for your next purchase.

Is there anything else you need help with regarding your order?

Best regards,
[Agent Name]
Customer Support Team
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-3">Automatic System Actions:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Verified order details in inventory system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Created replacement shipment order
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Applied 10% discount to customer account
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Scheduled follow-up survey for 24 hours after delivery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Added incident to quality control database
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Assistant Interface */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 pb-3 border-b-2" style={{ color: '#4a6bff', borderColor: '#4a6bff' }}>
            AI Assistant Interface
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Harness the power of Gemini 2.0 Flash to generate email responses, analyze sentiment, and answer your questions with AI precision. 
            Choose from three powerful modes to enhance your customer communication workflow.
          </p>

          {/* Endpoint Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon;
              const isSelected = selectedEndpoint === endpoint.id;
              
              return (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-105 ${
                    isSelected 
                      ? 'shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: isSelected ? endpoint.bgColor : 'white',
                    borderColor: isSelected ? endpoint.borderColor : '#e5e7eb'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="p-3 rounded-lg text-white"
                      style={{ background: endpoint.gradient }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{endpoint.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{endpoint.description}</p>
                </button>
              );
            })}
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                  style={{
                    background: loading 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                      : 'linear-gradient(135deg, #4a6bff 0%, #6c45e4 100%)'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {renderResponse()}
          </div>
        </div>

        {/* Key Platform Features */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2" style={{ color: '#4a6bff', borderColor: '#4a6bff' }}>
            Key Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Advanced AI Analysis',
                description: 'Sophisticated intent recognition, sentiment analysis, and entity extraction with high accuracy rates.'
              },
              {
                icon: Bot,
                title: 'Agentic Intelligence',
                description: 'Autonomous decision-making capabilities that can handle complex customer interactions.'
              },
              {
                icon: Users,
                title: 'Human Oversight',
                description: 'Optional human review and editing of AI-generated responses for quality control.'
              },
              {
                icon: Settings,
                title: 'AI Training',
                description: 'Customizable AI models that learn from interactions to continuously improve response quality.'
              },
              {
                icon: Plug,
                title: 'Omnichannel Integration',
                description: 'Seamless integration with email, WhatsApp, Instagram, Twitter, SMS and more.'
              },
              {
                icon: Shield,
                title: 'Security & Compliance',
                description: 'Enterprise-grade security with GDPR, CCPA, and HIPAA compliance built-in.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Comprehensive performance metrics and insights across all channels and interactions.'
              },
              {
                icon: Plug,
                title: 'Third-Party Integrations',
                description: 'Connect with Salesforce, Zendesk, Shopify and other business systems.'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8" style={{ color: '#4a6bff' }} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
    
          <p className="text-sm text-gray-500 mt-4">
            NeuronsCX - Intelligent Customer Experience Platform © 2025
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;