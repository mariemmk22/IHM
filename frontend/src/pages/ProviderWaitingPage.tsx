import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshMe } from "@/lib/api";
import { motion } from "framer-motion";
import { Clock, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProviderWaitingPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Poll pour vérifier si l'admin a accepté
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const response = await refreshMe();
        if (response && response.user && response.user.statutCompte === "actif") {
          updateUser(response.user);
          // Rafraîchir la page après 1 seconde pour que les changements se propagent
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.log("Vérification du statut en cours...");
      } finally {
        setCheckingStatus(false);
      }
    }, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, [updateUser]);

  const fullName = user?.prenom && user?.nom 
    ? `${user.prenom} ${user.nom}` 
    : user?.email || "Prestataire";

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf2f8 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .waiting-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
          padding: 60px 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        .pulse-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7);
          }
          50% {
            box-shadow: 0 0 0 30px rgba(251, 146, 60, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(251, 146, 60, 0);
          }
        }
        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 16px;
        }
        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .info-box {
          background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 32px;
        }
        .info-label {
          font-size: 13px;
          color: #6366f1;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .info-value {
          font-size: 16px;
          color: #1e1b4b;
          font-weight: 600;
        }
        .checklist {
          background: #f9fafb;
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          margin-bottom: 32px;
        }
        .check-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #4b5563;
        }
        .check-item:last-child {
          margin-bottom: 0;
        }
        .check-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #d1fae5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #059669;
          margin-top: 2px;
        }
        .loading-text {
          font-size: 13px;
          color: #6366f1;
          font-weight: 500;
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .spinner {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6366f1;
          animation: spin 1.5s steps(6) infinite;
          display: inline-block;
          margin: 0 2px;
        }
        .spinner:nth-child(2) { animation-delay: 0.2s; }
        .spinner:nth-child(3) { animation-delay: 0.4s; }
        @keyframes spin {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          justify-content: center;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1.5px solid #e0e7ff;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #4f46e5;
        }
        .btn-secondary:hover {
          background: #eef2ff;
          border-color: #6366f1;
        }
        @media (max-width: 768px) {
          .waiting-container {
            padding: 40px 24px;
          }
          .title {
            font-size: 24px;
          }
          .pulse-icon {
            width: 100px;
            height: 100px;
          }
          .action-buttons {
            flex-direction: column;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="waiting-container"
      >
        <div className="icon-wrapper">
          <div className="pulse-icon">
            <Clock size={56} color="#f59e0b" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="title">En attente de validation</h1>
        <p className="subtitle">
          Votre demande d'inscription en tant que prestataire est en cours de traitement
        </p>

        <div className="info-box">
          <div className="info-label">Compte en cours de validation</div>
          <div className="info-value">{fullName}</div>
        </div>

        <div className="checklist">
          <div className="check-item">
            <div className="check-icon">✓</div>
            <div>
              <strong>Profil créé avec succès</strong>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                Vos informations ont été enregistrées
              </div>
            </div>
          </div>
          <div className="check-item">
            <div className="check-icon">✓</div>
            <div>
              <strong>Documents téléchargés</strong>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                CV et justificatifs reçus
              </div>
            </div>
          </div>
          <div className="check-item">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", marginTop: "2px" }}>
                ⏳
              </div>
              <div>
                <strong>En attente d'approbation admin</strong>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                  L'administrateur examine votre demande
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
            ⏱️ <strong>Délai de traitement :</strong> 24-48 heures
          </p>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
            📧 Vous recevrez un email de confirmation dès que votre demande sera approuvée
          </p>
        </div>

        {checkingStatus && (
          <div className="loading-text">
            Vérification du statut
            <span className="spinner"></span>
            <span className="spinner"></span>
            <span className="spinner"></span>
          </div>
        )}

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate("/")}>
            <Home size={16} />
            Accueil
          </button>
          <button className="btn-secondary" onClick={() => { logout(); navigate("/"); }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </motion.div>
    </div>
  );
}
