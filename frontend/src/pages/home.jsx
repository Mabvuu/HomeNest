import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCheckCircle, faList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


/** Fake initial data **/
const fakeProperties = [
  {
    id: 2,
    type: 'Freehold',
    address: '123 Fake Street, Springfield',
    status: 'verified',
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: '1500 sqft',
      yard: 'Large fenced yard',
      neighborhood: 'Quiet cul-de-sac'
    },
    warnings: ['Gutters need cleaning', 'Roof needs replacing'],
    images: ['/images/4.jpg', '/images/3.jpg']
  },
  {
    id: 3,
    type: 'Leasehold',
    address: '456 Elm Road, Shelbyville',
    status: 'failed',
    reason: 'Unauthorised title deeds'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('Register Property');
  const [properties, setProperties] = useState(fakeProperties);

  const pages = {
    'Register Property': (
      <RegisterProperty
        onSave={prop => {
          setProperties(ps => [
            { ...prop, id: ps.length + 1, status: 'waiting' },
            ...ps
          ]);
          setCurrentPage('Verification');
        }}
      />
    ),
    'Verification': <PropertiesPage properties={properties} />,
    'Listings': <PropertyReview properties={properties} />
  };

  return (
    <div className="flex h-screen">
      <div className="relative flex-shrink-0 w-1/4 bg-gray-100 p-6 flex flex-col items-center">
  {/* Logo as JPG */}
  <img
    src="/images/logo.png"
    alt="Logo"
    className="mb-8 w-40 h-auto object-contain"
  />

  {/* Page buttons */}
<div className="flex flex-col h-full">


  {/* Buttons Section */}
  <div className="flex flex-col flex-grow justify-center space-y-6">
    {[
      { name: 'Register Property', icon: faHome },
      { name: 'Verification', icon: faCheckCircle },
      { name: 'Listings', icon: faList },
    ].map(({ name, icon }) => (
      <button
        key={name}
        onClick={() => setCurrentPage(name)}
        className={`flex items-center w-4/5 max-w-md mx-auto px-4 py-2 rounded ${
          currentPage === name
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-blue-120'
        }`}
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {name}
      </button>
    ))}
  </div>

  {/* Logout Section */}
  <div className="flex items-center justify-center py-6 border-t">
    <button
      onClick={() => console.log('Logging out')} // Replace with your logout logic
      className="flex items-center w-4/5 max-w-md px-4 py-2 rounded bg-white text-gray-700 hover:bg-blue-50"
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
      Logout
    </button>
  </div>
</div>



  {/* Right-edge border stripes */}
  <div className="absolute right-0 top-0 h-full w-px bg-white" />
  <div className="absolute right-1 top-0 h-full w-px bg-blue-500" />
</div>

      <div className="w-3/4 bg-white overflow-auto">{pages[currentPage]}</div>
    </div>
  );
}

function RegisterProperty({ onSave }) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState({});
  const [uploadDone, setUploadDone] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState({ type: '', address: '' });
  const [brokerInfo, setBrokerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [docs, setDocs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const propertyTypes = [
    'Freehold',
    'Leasehold',
    'Unit Title',
    'Condominium',
    'Cooperative Housing',
    'Land',
    'Commercial',
    'Industrial',
    'Agricultural'
  ];
  const validProp = () => propertyInfo.type && propertyInfo.address;
  const validBroker = () => Object.values(brokerInfo).every(v => v);

  useEffect(() => {
    if (!propertyInfo.address) return setSuggestions([]);
    const h = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          propertyInfo.address
        )}&limit=5`
      )
        .then(r => r.json())
        .then(data => setSuggestions(data.map(d => d.display_name)))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(h);
  }, [propertyInfo.address]);

  const next = () => {
    if (step === 1 && validProp()) {
      setCompleted(s => ({ ...s, 1: true }));
      setStep(2);
    } else if (step === 2 && validBroker()) {
      setCompleted(s => ({ ...s, 2: true }));
      setStep(3);
    }
  };

  const handleDocs = e => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (files.length + docs.length <= 5) {
      setDocs(d => [...d, ...files]);
    } else {
      alert('Max 5 PDFs');
    }
  };

  const submitAll = () => {
    setCompleted(s => ({ ...s, 3: true }));
    setUploadDone(true);
    onSave(propertyInfo);
  };

  return (
    <div className="p-8">
      <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded">
        <p className="font-medium text-indigo-700">👋 Welcome to Home Nest</p>
      </div>
      <h1 className="text-3xl font-extrabold mb-8 uppercase pb-2 border-b-4 border-indigo-500 inline-block">Register Your Property</h1>
      <p className="font-lg py-8">To start using Home Nest, you'll need to add your  properties, so lets get you started by registering your home </p>
      <div className="flex items-start space-x-6">
        <div className="w-1/3 p-4 bg-gray-50  rounded">
          <h2 className="font-semibold mb-2">What you need to do:</h2>
         <div className="bg-gray-50 p-6 rounded-lg shadow-md">
  <ul className="space-y-4">
    {[
      { text: 'Fill out property details', completed: completed[1] },
      { text: 'Fill out broker details', completed: completed[2] },
      { text: 'Upload documents', completed: completed[3] },
    ].map((item, index) => (
      <li key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md">
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full text-white font-bold ${
            item.completed ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          {item.completed ? '✓' : index + 1}
        </div>
        <div className="ml-4">
          <p className="text-gray-800 font-medium">{item.text}</p>
          {item.completed && (
            <p className="text-sm italic text-red-500">Waiting for verification</p>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>

        </div>
        <div className="w-2/3">
          <div className="mb-6 flex space-x-4">
            {['Property Info', 'Broker Info', 'Upload Docs'].map((lbl, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    step === i + 1
                      ? 'bg-blue-600'
                      : completed[i + 1]
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                >
                  {completed[i + 1] ? '✓' : i + 1}
                </div>
                <span>{lbl}</span>
                {completed[i + 1] && (
                  <button
                    className="text-sm underline text-blue-600"
                    onClick={() => setStep(i + 1)}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Type of Property</label>
                <select
                  className="w-full border p-2"
                  value={propertyInfo.type}
                  onChange={e =>
                    setPropertyInfo(p => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  {propertyTypes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 relative">
                <label className="block mb-1">Address</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  placeholder="Start typing..."
                  value={propertyInfo.address}
                  onChange={e =>
                    setPropertyInfo(p => ({ ...p, address: e.target.value }))
                  }
                />
                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full max-h-40 overflow-auto z-10">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setPropertyInfo(p => ({ ...p, address: s }));
                          setSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={next}
                disabled={!validProp()}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {['firstName', 'lastName', 'email', 'phone'].map(k => (
                <div className="mb-4" key={k}>
                  <label className="block mb-1">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                  <input
                    type={k === 'email' ? 'email' : k === 'phone' ? 'tel' : 'text'}
                    className="w-full border p-2"
                    value={brokerInfo[k]}
                    onChange={e =>
                      setBrokerInfo(b => ({ ...b, [k]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <button
                onClick={next}
                disabled={!validBroker()}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Upload Documents</label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleDocs}
                  className="mb-2"
                />
                <ul className="list-disc ml-6 space-y-1">
                  {docs.map((d, i) => (
                    <li key={i}>{d.name}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={submitAll}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Upload Done
              </button>
              {uploadDone && (
                <p className="mt-2 italic text-green-700">Upload done.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PropertiesPage({ properties }) {
  const [selected, setSelected] = useState(null);

  return (
   <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col items-center p-8">
  {/* Header with Unique Typography */}
  <h1 className="text-3xl font-bold mb-8 uppercase pb-2 border-b-4 border-indigo-500 inline-block">
    PROPERTY DASHBOARD
  </h1>

  {/* Creative Properties List */}
  <div className="grid gap-8 md:grid-cols-3 max-w-7xl w-full px-4">
  {properties.map((prop) => (
    <div
      key={prop.id}
      onClick={() => setSelected(prop)}
      className="
        relative
        bg-gray-50 p-6 rounded-lg shadow-lg
        cursor-pointer
        transition-transform hover:scale-105
        border-4 border-transparent hover:border-blue-400
      "
    >
      {/* Property Info */}
      <h2 className="text-xl font-bold mb-2">{prop.type}</h2>
      <p className="text-sm mb-4">{prop.address}</p>

      {/* Status Badge */}
      <span
        className={`
          absolute top-4 right-4
          inline-block px-3 py-1 text-xs font-semibold
          rounded-full shadow
          ${prop.status === 'verified'
            ? 'bg-green-500 text-white'
            : prop.status === 'failed'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-300 text-gray-800'}
        `}
        style={{
          clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 10%)'
        }}
      >
        {prop.status === 'waiting'
          ? 'Awaiting Verification'
          : prop.status.charAt(0).toUpperCase() + prop.status.slice(1)}
      </span>

      {/* Tiny “Verified” Tag */}
      {prop.status === 'verified' && (
        <span className="absolute bottom-2 right-2 text-xs text-green-700">
          ✔ Verified
        </span>
      )}
    </div>
  ))}
</div>


      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-/3">
            <h2 className="text-2xl font-bold mb-2">{selected.type}</h2>
            <p className="mb-4">{selected.address}</p>
            <p className="font-semibold">
              Status:{' '}
              <span
                className={
                  selected.status === 'verified'
                    ? 'text-green-600'
                    : selected.status === 'failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }
              >
                {selected.status === 'waiting'
                  ? 'Waiting for verification'
                  : selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
              </span>
            </p>
            {selected.status === 'failed' && (
              <p className="mt-4 text-red-700">
                <strong>Reason:</strong> {selected.reason}
              </p>
            )}
            <button
              className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyReview({ properties }) {
  const prop = properties.find(p => p.status === 'verified');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [reason, setReason] = useState('');

  if (!prop) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Review Property</h1>
        <p>No verified property available.</p>
      </div>
    );
  }

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  return (
   <div className="p-8 bg-gray-50">
  <h1 className="text-3xl font-extrabold mb-8 uppercase pb-2 border-b-4 border-indigo-500 inline-block">
    Review Property
  </h1>

  <div
    onClick={() => {
      setOpen(true);
      setStep(1);
    }}
    className="
      mt-6
      max-w-sm
      bg-gradient-to-br from-white via-blue-50 to-white
      border border-gray-200 rounded-2xl
      shadow-lg hover:shadow-2xl
      transform hover:-translate-y-1 hover:scale-105
      transition duration-300
      cursor-pointer
      overflow-hidden
    "
  >
    {/* optional featured image */}
    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${prop.imageUrl})` }} />

    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800">{prop.type}</h2>
      <p className="mt-2 text-gray-600">{prop.address}</p>

      <span className="
        mt-4 inline-flex items-center
        text-xs font-medium
        bg-green-100 text-green-800
        px-2.5 py-1.5 rounded-full
        before:content-[''] before:inline-block before:w-2 before:h-2 before:mr-2
        before:rounded-full before:bg-green-500
      ">
        Verified
      </span>
    </div>
  </div>


      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg w-2/3 max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Details & Warnings</h2>
                <p>
                  <strong>Bedrooms:</strong> {prop.details.bedrooms}
                </p>
                <p>
                  <strong>Bathrooms:</strong> {prop.details.bathrooms}
                </p>
                <p>
                  <strong>Area:</strong> {prop.details.area}
                </p>
                <p>
                  <strong>Yard:</strong> {prop.details.yard}
                </p>
                <p>
                  <strong>Neighborhood:</strong> {prop.details.neighborhood}
                </p>
                <div className="mt-4">
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {prop.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Image 1</h2>
                <img
                  src={prop.images[0]}
                  alt="House front"
                  className={`mx-auto cursor-pointer ${
                    zoomed ? 'w-full' : 'w-2/3'
                  }`}
                  onClick={() => setZoomed(z => !z)}
                />
                <p className="text-center text-sm italic mt-2">
                  Click image to {zoomed ? 'shrink' : 'zoom'}
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Image 2 & Re-evaluation
                </h2>
                <img
                  src={prop.images[1]}
                  alt="House back"
                  className={`mx-auto cursor-pointer ${
                    zoomed ? 'w-full' : 'w-2/3'
                  }`}
                  onClick={() => setZoomed(z => !z)}
                />
                <p className="text-center text-sm italic mt-2">
                  Click image to {zoomed ? 'shrink' : 'zoom'}
                </p>
                <div className="mt-6">
                  <label className="block mb-2 font-semibold">
                    Ask for Re-evaluation:
                  </label>
                  <textarea
                    className="w-full border p-2"
                    rows={4}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Your reasons..."
                  />
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => {
                      console.log('Re-eval request:', reason);
                      setOpen(false);
                    }}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={prev}
                disabled={step === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Back
              </button>
              {step < 3 ? (
                <button
                  onClick={next}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
