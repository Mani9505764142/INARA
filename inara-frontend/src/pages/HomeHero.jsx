// src/pages/HomeHero.jsx
import React, { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FooterNav from "../components/FooterNav";

// *** ADDED THIS ONE LINE ***
import inaraLogo from "../assets/images/inara-logo.png";

export default function HomeHero() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const onExplore = useCallback((e) => {
    e && e.preventDefault();
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/product";
    }
  }, []);

  const ANIM = useMemo(
    () => ({
      logoFloat: "5.5s",
      glowPulse: "3.6s",
      cardIntro: "700ms",
    }),
    []
  );

  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 2,
        bgcolor: "#FBF5EE",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.0) 0%, rgba(0,0,0,0.02) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 760,
          textAlign: "center",
          backgroundColor: "rgba(251,245,238,0.95)",
          borderRadius: { xs: 2, md: 3 },
          boxShadow: "0 22px 80px rgba(0,0,0,0.22)",
          py: isMd ? 8 : 5,
          px: isMd ? 8 : 4,
          backdropFilter: "blur(3px)",
          opacity: 0,
          transform: "scale(0.985)",
          animation: `cardIntro ${ANIM.cardIntro} cubic-bezier(.2,.9,.24,1) forwards 150ms`,
        }}
        role="region"
        aria-labelledby="hero-heading"
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: isMd ? 3 : 2 }}>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: isMd ? 160 : 120,
              height: isMd ? 160 : 120,
              borderRadius: "50%",
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(closest-side, rgba(255,230,170,0.35), rgba(255,200,80,0.06) 40%, transparent 60%)",
              filter: "blur(8px)",
              animation: `glowPulse ${ANIM.glowPulse} ease-in-out infinite`,
            }}
            aria-hidden="true"
          />

          {/* *** ONLY CHANGE HERE -> src={inaraLogo} *** */}
          <Box
            component="img"
            src={inaraLogo}
            alt="INARA logo"
            sx={{
              width: isMd ? 120 : 92,
              height: isMd ? 120 : 92,
              borderRadius: "50%",
              display: "block",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
              animation: `floatLogo ${ANIM.logoFloat} ease-in-out infinite`,
              objectFit: "cover",
              backgroundColor: "transparent",
            }}
            loading="eager"
            decoding="async"
            draggable="false"
          />
        </Box>

        <Typography
          id="hero-heading"
          component="h1"
          variant={isMd ? "h3" : "h4"}
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: "primary.main",
            mb: 1,
            letterSpacing: 0.4,
          }}
        >
          Namaste
        </Typography>

        <Typography sx={{ color: "text.secondary", fontSize: isMd ? 19 : 15, mb: 4 }}>
          HANDMADE WITH LOVE
        </Typography>

        <Button
          onClick={onExplore}
          variant="contained"
          color="primary"
          aria-label="Explore products"
          sx={{
            px: isMd ? 9 : 6,
            py: 1.6,
            borderRadius: 6,
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            boxShadow: "0 12px 34px rgba(0,0,0,0.18)",
            background: "linear-gradient(180deg, #7e2626 0%, #6a1f1f 100%)",
            transition: "transform 220ms cubic-bezier(.2,.9,.24,1), box-shadow 220ms",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 22px 54px rgba(0,0,0,0.28)",
              background: "linear-gradient(180deg, #8b2f2f 0%, #6e2222 100%)",
            },
            "&:focus-visible": {
              outline: "2px solid rgba(255,230,170,0.35)",
              outlineOffset: 4,
            },
          }}
        >
          EXPLORE NOW
        </Button>
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" }, zIndex: 5 }}>
        <FooterNav />
      </Box>

      <style>{`
        @keyframes floatLogo {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse {
          0% { transform: scale(0.98); opacity: 0.92; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(0.98); opacity: 0.92; }
        }
        @keyframes cardIntro {
          0% { opacity: 0; transform: scale(0.985); }
          100% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </Box>
  );
}
