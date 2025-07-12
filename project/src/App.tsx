import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import AddPropertyPage from './pages/AddPropertyPage';
import FavoritesPage from './pages/FavoritesPage';
import { Property } from './types';

type Page = 'home' | 'login' | 'signup' | 'messages' | 'profile' | 'add-property' | 'favorites';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [contactProperty, setContactProperty] = useState<Property | null>(null);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setContactProperty(null);
  };

  const handleContactSeller = (property: Property) => {
    setContactProperty(property);
    setCurrentPage('messages');
  };

  const handleViewDetails = (property: Property) => {
    // This will be handled by the PropertyModal in HomePage
    console.log('View details for:', property.title);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setContactProperty(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onContactSeller={handleContactSeller} />;
      case 'login':
        return <LoginPage onSuccess={handleAuthSuccess} />;
      case 'signup':
        return <SignupPage onSuccess={handleAuthSuccess} />;
      case 'messages':
        return (
          <MessagesPage
            contactProperty={contactProperty}
            onBack={contactProperty ? handleBackToHome : undefined}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            onContactSeller={handleContactSeller}
            onViewDetails={handleViewDetails}
          />
        );
      case 'add-property':
        return <AddPropertyPage onSuccess={handleBackToHome} />;
      case 'favorites':
        return (
          <FavoritesPage
            onContactSeller={handleContactSeller}
            onViewDetails={handleViewDetails}
          />
        );
      default:
        return <HomePage onContactSeller={handleContactSeller} />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} onPageChange={handlePageChange} />
          <main>{renderCurrentPage()}</main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;