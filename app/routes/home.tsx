import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import OurPartners from '../components/OurPartners';
import FAQ from '../components/FAQItem';
import CarbonCalculator from '../components/CarbonCalculator';
import EcoTips from '../components/EcoTips';
import AirAlerts from '../components/AirAlerts';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
  <>
    <Welcome />
    <OurPartners />
    <FAQ />
    <CarbonCalculator />
    <EcoTips />
    <AirAlerts />
  </>);
}
