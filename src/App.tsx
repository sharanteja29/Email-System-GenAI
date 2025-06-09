import React, { useState } from 'react';
import { Send, Mail, MessageCircle, Search, Loader2, CheckCircle, AlertCircle, Brain, Bot, Users, Shield, BarChart3, Settings, Plug } from 'lucide-react';
import { X } from 'lucide-react';

type Endpoint = 'home' | 'router' | 'query' | 'customer_care_team';
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
  rag_results?: {
    answer: string;
    [key: string]: any; // for any additional fields returned by the API
  };
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
    },
    {
      id: 'customer_care_team' as Endpoint,
      label: 'Customer Care',
      description: 'Get customer care answers from a knowledge base using Retrieval-Augmented Generation',
      icon: Users,
      gradient: 'linear-gradient(135deg, #f59e42 0%, #fbbf24 100%)',
      bgColor: '#fff7ed',
      borderColor: '#f59e42'
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // Place this handler inside your App component
  const handleEndpointChange = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setFormData({
      sender: '',
      subject: '',
      body: '',
      user_query: ''
    });
    setResponse(null);
    setError(null);
  };

  {/* Endpoint Selection */ }
  <div className="flex flex-col md:flex-row gap-6 mb-8">
    {endpoints.map((endpoint) => {
      const Icon = endpoint.icon;
      const isSelected = selectedEndpoint === endpoint.id;

      return (
        <button
          key={endpoint.id}
          onClick={() => handleEndpointChange(endpoint.id)}
          className={`flex-1 p-6 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-105 ${isSelected
            ? 'shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:shadow-md'
            }`}
          style={{
            backgroundColor: isSelected ? endpoint.bgColor : 'white',
            borderColor: isSelected ? endpoint.borderColor : '#e5e7eb',
            minWidth: 0 // allow shrinking on small screens
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
    },
    customer_care_team: {
      end_point: "customer_care_team",
      user_query: "How do I contact support?",
      rag_results: {
        answer: "You can contact our customer care team by emailing support@example.com or calling 1-800-123-4567. Our team is available 24/7 to assist you with any queries."
      }
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
      } else if (selectedEndpoint === "customer_care_team") {
        payload = { user_query: formData.user_query };
        url = `${AZURE_BASE_URL}/customer_care_team`;
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
      setError("Failed to process request. Showing demo response.");
      setResponse(DEMO_RESPONSES[selectedEndpoint]);
    } finally {
      setLoading(false);
    }
  };


  const renderFormFields = () => {
    if (selectedEndpoint === 'query' || selectedEndpoint === 'customer_care_team') {
      return (
        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="user_query" className="block text-sm font-semibold text-gray-700 mb-3">
              Your Query
            </label>
            <textarea
              id="user_query"
              value={formData.user_query}
              onChange={(e) => handleInputChange('user_query', e.target.value)}
              placeholder="Ask your question here..."
              className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700 bg-white shadow-sm pr-10"
              rows={4}
              required
            />
            {formData.user_query && (
              <button
                type="button"
                onClick={() => handleInputChange('user_query', '')}
                className="absolute top-10 right-3 text-gray-400 hover:text-red-500"
                tabIndex={-1}
                aria-label="Clear"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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

    // Copy to clipboard utility
    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    if (response.end_point === 'query') {
      // Only show AI Response with a copy button and a better icon
      return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span>AI Output</span>
          </div>
          <div className="p-6 bg-white">
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-green-700">AI Generated Response</span>
                <button
                  type="button"
                  onClick={() => handleCopy(response.query_response || "")}
                  className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                  title="Copy AI Response"
                >
                  <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span>Copy
                </button>
              </div>
              <div className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                {response.query_response}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (response.end_point === 'router') {
      // Sentiment and Explanation each have their own copy button, better icon
      return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span>AI Output</span>
          </div>
          <div className="p-6 bg-white">
            <div className="mb-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700">Sentiment</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(response.sentiment || "")}
                    className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                    title="Copy Sentiment"
                  >
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span>Copy
                  </button>
                </div>
                <div className="bg-gray-50 border-l-4 border-green-400 p-3 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                  {response.sentiment}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700">AI Generated Response</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(response.explanation || "")}
                    className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                    title="Copy Explanation"
                  >
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span>Copy
                  </button>
                </div>
                <div className="bg-gray-50 border-l-4 border-green-400 p-3 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                  {response.explanation}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // ...existing code...
    else if (response.end_point === 'customer_care_team') {
      // Print the customer_care_team result in the console
      console.log("customer_care_team result:", response);

      return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold flex items-center gap-3">
            <Users className="h-5 w-5" />
            <span>AI Output</span>
          </div>
          <div className="p-6 bg-white">
            <div className="mb-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-green-700">AI Response</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(response.rag_results?.answer || "")}
                    className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                    title="Copy RAG Output"
                  >
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span>Copy
                  </button>
                </div>
                <div className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                  {response.rag_results?.answer}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      // home endpoint: show subject and AI response with copy button and better icon
      return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span>AI Output</span>
          </div>
          <div className="p-6 bg-white">
            <div className="mb-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700">Subject</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(response.subject || "")}
                    className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                    title="Copy Subject"
                  >
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span> Copy
                  </button>
                </div>
                <div className="bg-gray-50 border-l-4 border-green-400 p-3 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                  {response.subject}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-green-700">AI Generated Response</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(response.body || "")}
                    className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono border border-blue-200 hover:bg-blue-200 transition flex items-center"
                    title="Copy Output"
                  >
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}></span> Copy
                  </button>
                </div>
                <div className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-lg whitespace-pre-line text-gray-800 font-mono text-sm">
                  {response.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
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
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon;
              const isSelected = selectedEndpoint === endpoint.id;

              return (
                <button
                  key={endpoint.id}
                  onClick={() => handleEndpointChange(endpoint.id)}
                  className={`flex-1 p-6 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-105 ${isSelected
                    ? 'shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:shadow-md'
                    }`}
                  style={{
                    backgroundColor: isSelected ? endpoint.bgColor : 'white',
                    borderColor: isSelected ? endpoint.borderColor : '#e5e7eb',
                    minWidth: 0 // allow shrinking on small screens
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