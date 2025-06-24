import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import OurPartners from '../components/OurPartners';
import FAQ from '../components/FAQItem';
import CarbonCalculator from '../components/CarbonCalculator';
import EcoTips from '../components/EcoTips';
import AirAlerts from '../components/AirAlerts';
import "./home.css";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
  <>
    <Link to="/map" className="back-to-map-button" title="Retour à la carte">
      <ArrowLeft size={28} />
    </Link>
    <OurPartners />
    <FAQ />
    <CarbonCalculator />
    <EcoTips />
    <AirAlerts />
    <script src="https://cdn.botpress.cloud/webchat/v3.0/inject.js" defer></script>
<script src="https://files.bpcontent.cloud/2025/06/24/07/20250624073710-L4SA2ZI3.js" defer></script>
  </>
  );
}
