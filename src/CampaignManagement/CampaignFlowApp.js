import React, { useState } from "react";
import CampaignMenu from "./components/CampaignMenu";
import SimplifiedForm from "./components/SimplifiedForm";
import CampaignFormDetailed from "./components/CampaignFormDetailed";
import PricingPlans from "./components/PricingPlans";
import NavigationBar from "./components/NavigationBar";

const CampaignFlowApp = () => {
  const [currentStep, setCurrentStep] = useState("menu");

  const handleNavigation = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      {currentStep === "menu" && <CampaignMenu onNavigate={handleNavigation} />}
      {currentStep === "simplified" && (
        <SimplifiedForm onNavigate={handleNavigation} />
      )}
      {currentStep === "detailed" && (
        <CampaignFormDetailed onNavigate={handleNavigation} />
      )}
      {currentStep === "pricing" && (
        <PricingPlans onNavigate={handleNavigation} />
      )}
    </div>
  );
};

export default CampaignFlowApp;
