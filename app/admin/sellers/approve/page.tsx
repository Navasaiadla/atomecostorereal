import { CheckCircle, XCircle, Eye, Clock, Store, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function AdminSellerApprovePage() {
  const pendingSellers = [
    {
      id: 1,
      name: 'Bamboo Bliss',
      email: 'info@bamboobliss.com',
      phone: '+91 98765 43212',
      address: 'Mumbai, Maharashtra',
      businessType: 'Manufacturer',
      products: ['Bamboo Utensils', 'Bamboo Cups', 'Bamboo Straws'],
      description: 'Eco-friendly bamboo products manufacturer with 5 years of experience in sustainable products.',
      documents: ['GST Certificate', 'Business License', 'Product Certifications'],
      appliedDate: '2024-01-20',
      status: 'Pending Review'
    },
    {
      id: 2,
      name: 'Green Living Solutions',
      email: 'contact@greenliving.com',
      phone: '+91 98765 43213',
      address: 'Bangalore, Karnataka',
      businessType: 'Retailer',
      products: ['Organic Cotton', 'Natural Soaps', 'Eco Bags'],
      description: 'Retail store specializing in organic and natural lifestyle products.',
      documents: ['GST Certificate', 'Shop License', 'Organic Certifications'],
      appliedDate: '2024-01-19',
      status: 'Pending Review'
    },
    {
      id: 3,
      name: 'EcoCraft India',
      email: 'hello@ecocraftindia.com',
      phone: '+91 98765 43214',
      address: 'Delhi, NCR',
      businessType: 'Artisan',
      products: ['Handmade Paper', 'Natural Dyes', 'Upcycled Products'],
      description: 'Traditional artisans creating eco-friendly handmade products.',
      documents: ['GST Certificate', 'Artisan Certificate', 'Product Samples'],
      appliedDate: '2024-01-18',
      status: 'Pending Review'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Approval</h1>
        <p className="text-gray-600 mt-2">Review and approve new seller applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected Today</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
        
        {pendingSellers.map((seller) => (
          <div key={seller.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                    <p className="text-sm text-gray-500">{seller.businessType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {seller.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Applied {new Date(seller.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{seller.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{seller.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{seller.address}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {seller.products.map((product, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Business Description</h4>
                <p className="text-sm text-gray-600">{seller.description}</p>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Submitted Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {seller.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Download Documents</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Reject</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Approve</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Approve All Verified</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Mark for Review</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
} 