import React from 'react';
import { Award, Presentation, Image, Briefcase, Video, Sparkles } from 'lucide-react';

function LandingPage({ onSelectSection }) {
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1c1c1c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      <h1
        style={{
          color: '#FFFFFF',
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          textAlign: 'center',
          letterSpacing: '-0.5px'
        }}
      >
        Welcome to <span style={{ color: '#4736FE' }}>Cars24</span> Creator Studio
      </h1>
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '18px',
          marginBottom: '60px',
          textAlign: 'center'
        }}
      >
        Choose what you'd like to create today
      </p>

      <div 
        style={{ 
          display: 'flex', 
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {/* Certificate Generator Card */}
        <div
          onClick={() => onSelectSection('certificate')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Award size={40} color="#FFFFFF" />
          </div>
          <h2 
            style={{ 
              color: '#FFFFFF', 
              fontSize: '24px', 
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            Certificate Generator
          </h2>
          <p 
            style={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Create beautiful award certificates with customizable templates. Upload Excel data for bulk generation.
          </p>
        </div>

        {/* PPT Creator Card */}
        <div
          onClick={() => onSelectSection('ppt')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #6B57FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Presentation size={40} color="#FFFFFF" />
          </div>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            PPT Creator
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Design stunning presentations with ease. Choose from templates and customize your slides.
          </p>
        </div>

        {/* Poster Creator Card */}
        <div
          onClick={() => onSelectSection('poster')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #8B7BFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Image size={40} color="#FFFFFF" />
          </div>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            Poster Creator
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Design A4 festival wish posters and event announcement posters with festive templates.
          </p>
        </div>

        {/* Job Description Creator Card */}
        <div
          onClick={() => onSelectSection('jd')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #6B57FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Briefcase size={40} color="#FFFFFF" />
          </div>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            Job Description
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Create branded A4 job description posters with editable fields and downloadable PDF export.
          </p>
        </div>
        {/* Video Templates Card */}
        <div
          onClick={() => onSelectSection('video')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #00C9A7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Video size={40} color="#FFFFFF" />
          </div>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            Video Templates
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Create animated video cards for birthdays, anniversaries, welcomes, awards and farewells — download as MP4 or WebM.
          </p>
        </div>

        {/* Festivals & Events Card */}
        <div
          onClick={() => onSelectSection('festivals')}
          style={{
            width: '320px',
            padding: '40px',
            backgroundColor: '#252525',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.border = '1px solid #4736FE';
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(71, 54, 254, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4736FE 0%, #FFD700 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(71, 54, 254, 0.35)'
            }}
          >
            <Sparkles size={40} color="#FFFFFF" />
          </div>
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            Festivals &amp; Events
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            Diwali, Holi, Eid, Christmas, Independence Day, Town Hall, Product Launch and more — branded A4 cards with 5 visual styles.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
