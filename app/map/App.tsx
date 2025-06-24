import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "~/components/LoadingSpinner";
import PollutionDetails from "~/components/PollutionDetails";
import PollutionLegend from "~/components/PollutionLegend";
import { PollutionApiService } from "~/services/pollutionApi";
import type { PollutionData, PollutionZone } from "~/types/pollution";
import { RefreshCw, MapPin, Info } from 'lucide-react';
import "./App.css";

const PollutionMap = lazy(() => import("~/components/PollutionMap"));

function App() {
  const [pollutionData, setPollutionData] = useState<PollutionData[]>([]);
  const [pollutionZones] = useState<PollutionZone[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PollutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chargement des données
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dataPoints = await PollutionApiService.getPollutionDataForStations();
      setPollutionData(dataPoints);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Erreur lors du chargement des données de pollution');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  // Rafraîchissement automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && pollutionData.length === 0) {
    return (
      <div className="full-page-loader">
        <LoadingSpinner />
        <span>Chargement des données...</span>
      </div>
    );
  }

  if (error && pollutionData.length === 0) {
    return (
      <div className="min-h-screen bg-site-light flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadData}
            className="refresh-button"
          >
            <RefreshCw width={16} height={16} />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-app-container">
      <header className="map-header">
        <div className="map-header-content">
          <div className="map-title-section">
            <div className="map-title-icon">
              <MapPin width={20} height={20} />
            </div>
            <div className="map-title-text">
              <h1>Qualité de l'Air - Bordeaux</h1>
              <p>Surveillance en temps réel de la pollution atmosphérique</p>
            </div>
          </div>
          
          <div className="map-controls">
            
            {lastUpdate && (
              <div className="last-update-info">
                Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
              </div>
            )}
            <button
              onClick={loadData}
              disabled={loading}
              className="refresh-button"
            >
              
              <RefreshCw width={16} height={16} className={loading ? 'spinner' : ''} />
              <span>Actualiser</span>
            </button>
            <Link to="/" className="details-link-button">
              Plus de détails
            </Link>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <PollutionLegend />
          <PollutionDetails data={selectedPoint} />
          
          <div className="info-box">
            <div className="info-box-header">
              <div className="info-box-icon">
                <Info width={12} height={12} />
              </div>
              <h4>Information</h4>
            </div>
            <p>
              Cliquez sur les points de mesure ou les zones colorées pour voir les détails.
              Les données sont actualisées automatiquement toutes les 5 minutes.
            </p>
          </div>
        </div>

        <div className="map-area">
          {isClient && (
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingSpinner/></div>}>
              <PollutionMap
                pollutionData={pollutionData}
                pollutionZones={pollutionZones}
                onPointSelect={setSelectedPoint}
              />
            </Suspense>
          )}
          
          {loading && (
            <div className="loading-indicator">
              <RefreshCw width={16} height={16} className="spinner" />
              <span>Actualisation...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
