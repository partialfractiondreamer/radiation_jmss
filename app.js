// Refactored Scientific Application Logic (VCE Physics Student Style)
// Authors: Selby Thompson & Alexander Dunn

document.addEventListener('DOMContentLoaded', () => {
  // --- THEME TOGGLE (Minimalist Text-based) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
  });

  function updateThemeButtonText(theme) {
    themeToggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  // --- COMPACT NAVIGATION SCROLLSPY ---
  const sections = document.querySelectorAll('section');
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- 1.0 EM SPECTRUM DATA & WIDGET LOGIC ---
  const emSpectrumData = {
    radio: {
      name: "Radio Waves",
      type: "non-ionizing",
      wavelength: "λ > 1 m",
      frequency: "ν < 300 MHz",
      energy: "E < 1.24 µeV",
      safety: "Non-ionising. Safe for human tissue.",
      applications: "Magnetic Resonance Imaging (MRI) radiofrequency pulses.",
      description: "Radio waves have the longest wavelengths and lowest energy in the spectrum. They do not have enough energy to knock electrons out of atoms, meaning they are non-ionising. In MRI scans, doctors use pulses of radio waves to flip the spin of hydrogen protons in the patient's body."
    },
    microwave: {
      name: "Microwaves",
      type: "non-ionizing",
      wavelength: "λ: 1 mm - 1 m",
      frequency: "ν: 300 MHz - 300 GHz",
      energy: "E: 1.24 µeV - 1.24 meV",
      safety: "Non-ionising. Can cause tissue heating at high intensity.",
      applications: "Tumor ablation therapy.",
      description: "Microwaves have slightly shorter wavelengths than radio waves. They make water molecules rotate, which generates heat. Doctors use this thermal effect in microwave ablation to heat and destroy cancer cells in tumors."
    },
    infrared: {
      name: "Infrared",
      type: "non-ionizing",
      wavelength: "λ: 700 nm - 1 mm",
      frequency: "ν: 300 GHz - 430 THz",
      energy: "E: 1.24 meV - 1.77 eV",
      safety: "Non-ionising. Safe; felt as heat on the skin.",
      applications: "Thermal imaging to locate inflammation.",
      description: "Infrared radiation is emitted by warm objects. It does not cause ionisation but increases the thermal energy of molecules. Medical thermal cameras detect infrared rays to locate areas of high blood flow or inflammation."
    },
    visible: {
      name: "Visible Light",
      type: "non-ionizing",
      wavelength: "λ: 400 nm - 700 nm",
      frequency: "ν: 430 THz - 750 THz",
      energy: "E: 1.77 eV - 3.1 eV",
      safety: "Non-ionising. Safe for tissue under normal levels.",
      applications: "Endoscopy and surgical illumination.",
      description: "Visible light is the only part of the spectrum human eyes can detect. It does not have enough energy to ionise tissue. Doctors use fiber-optic cables to shine visible light inside the body during endoscopy to inspect organs directly."
    },
    ultraviolet: {
      name: "Ultraviolet (UV)",
      type: "non-ionizing",
      wavelength: "λ: 10 nm - 400 nm",
      frequency: "ν: 750 THz - 30 PHz",
      energy: "E: 3.1 eV - 124 eV",
      safety: "Non-ionising boundary. Can cause chemical changes and DNA mutation.",
      applications: "Sterilising medical tools and phototherapy for skin conditions.",
      description: "Ultraviolet radiation lies at the boundary between ionising and non-ionising radiation. While most UV photons cannot knock inner-shell electrons out of atoms, they have enough energy to break chemical bonds. This can damage skin cells and cause mutations in DNA, which can lead to skin cancer."
    },
    xray: {
      name: "X-Rays",
      type: "ionizing",
      wavelength: "λ: 0.01 nm - 10 nm",
      frequency: "ν: 30 PHz - 30 EHz",
      energy: "E: 124 eV - 124 keV",
      safety: "Ionising. Can damage cell DNA and cause mutations.",
      applications: "Diagnostic X-ray radiography and CT scans.",
      description: "X-rays are high-energy waves that can pass through soft tissue but are absorbed by dense materials like bone. Because they are ionising, they carry enough energy to knock electrons out of atoms, which can damage cell DNA. Doctors use them to create shadow images of the skeleton."
    },
    gamma: {
      name: "Gamma Rays",
      type: "ionizing",
      wavelength: "λ < 0.01 nm",
      frequency: "ν > 30 EHz",
      energy: "E > 124 keV",
      safety: "Highly ionising. Strong penetration; damages cells.",
      applications: "Radiotherapy (Gamma Knife) and nuclear medicine tracer scans (PET/SPECT).",
      description: "Gamma rays are the highest energy waves in the spectrum and are emitted from unstable atomic nuclei. They have high penetrating power and are highly ionising. Doctors use them to kill cancer cells in targeted therapy or to trace chemical processes inside the body."
    }
  };

  const spectrumBtns = document.querySelectorAll('.spectrum-band-btn');
  const emTitle = document.getElementById('emTitle');
  const emTypeBadge = document.getElementById('emTypeBadge');
  const emWavelength = document.getElementById('emWavelength');
  const emFrequency = document.getElementById('emFrequency');
  const emEnergy = document.getElementById('emEnergy');
  const emSafety = document.getElementById('emSafety');
  const emApps = document.getElementById('emApps');
  const emDesc = document.getElementById('emDesc');

  spectrumBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      spectrumBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const bandKey = btn.dataset.band;
      updateEMDetails(bandKey);
    });
  });

  function updateEMDetails(key) {
    const data = emSpectrumData[key];
    emTitle.textContent = data.name;
    emWavelength.textContent = data.wavelength;
    emFrequency.textContent = data.frequency;
    emEnergy.textContent = data.energy;
    emSafety.textContent = data.safety;
    emApps.textContent = data.applications;
    emDesc.textContent = data.description;

    if (data.type === 'ionizing') {
      emTypeBadge.textContent = 'Ionising Radiation';
      emTypeBadge.className = 'tag tag-ionizing';
      emSafety.style.color = 'var(--color-ionizing)';
    } else {
      emTypeBadge.textContent = 'Non-Ionising';
      emTypeBadge.className = 'tag tag-nonionizing';
      emSafety.style.color = 'var(--color-nonionizing)';
    }
  }


  // --- 2.0 COOLIDGE X-RAY TUBE SIMULATOR ---
  const xrayCanvas = document.getElementById('xrayCanvas');
  const ctx = xrayCanvas.getContext('2d');
  const kvSlider = document.getElementById('kvSlider');
  const maSlider = document.getElementById('maSlider');
  const kvValue = document.getElementById('kvValue');
  const maValue = document.getElementById('maValue');
  const hotspotBtns = document.querySelectorAll('.hotspot-btn');
  const hotspotTitle = document.getElementById('hotspotTitle');
  const hotspotText = document.getElementById('hotspotText');

  xrayCanvas.width = 600;
  xrayCanvas.height = 400;

  const hotspots = {
    cathode: {
      title: "1. Filament Cathode Assembly",
      text: "The cathode is the negative electrode. It contains a tungsten filament that we heat by passing a current through it. Heating the filament gives its electrons enough thermal energy to escape the surface, a process called thermionic emission. The surrounding focusing cup repels the electrons to keep them in a narrow beam."
    },
    anode: {
      title: "2. Tungsten Anode Target",
      text: "The anode is the positive electrode. It contains a target made of tungsten, which is chosen because it has a high melting point and can withstand the extreme heat. When the accelerated electrons collide with this target, they decelerate rapidly, converting their kinetic energy into X-ray photons and heat."
    },
    envelope: {
      title: "3. Vacuum Envelope",
      text: "The glass envelope maintains a vacuum around the cathode and anode. If air molecules were present inside the tube, the accelerated electrons would collide with them and lose energy before reaching the target. The vacuum also prevents the hot filament from burning up."
    },
    window: {
      title: "4. Beryllium Window",
      text: "The window is a thin section in the tube's lead housing that allows X-rays to escape toward the patient. It is usually made of beryllium because beryllium atoms have very few electrons and do not absorb many X-rays."
    }
  };

  hotspotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hotspotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.hotspot;
      hotspotTitle.textContent = hotspots[key].title;
      hotspotText.textContent = hotspots[key].text;
    });
  });

  // Flat Simulator Particle State
  let electrons = [];
  let xrayWaves = [];

  class Electron {
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.speed = speed;
    }
    update() {
      this.x += this.speed;
    }
    draw() {
      ctx.fillStyle = '#38bdf8'; // Flat light blue
      ctx.fillRect(this.x, this.y, 3, 3);
    }
  }

  class XrayWave {
    constructor(x, y, speedY) {
      this.x = x;
      this.y = y;
      this.speedY = speedY;
      this.life = 1.0;
      this.phase = Math.random() * Math.PI;
    }
    update() {
      this.y += this.speedY;
      this.life -= 0.03;
    }
    draw() {
      ctx.save();
      ctx.strokeStyle = `rgba(168, 85, 247, ${this.life})`; // Flat purple
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const waveHeight = 60;
      for (let i = 0; i < waveHeight; i += 2) {
        const dY = this.y + i;
        const dX = this.x + Math.sin(dY * 0.15 + this.phase) * 6 * (1 - i / waveHeight);
        if (i === 0) {
          ctx.moveTo(dX, dY);
        } else {
          ctx.lineTo(dX, dY);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  function animateXray() {
    ctx.fillStyle = '#0f172a'; // Dark Slate
    ctx.fillRect(0, 0, xrayCanvas.width, xrayCanvas.height);

    const kv = parseFloat(kvSlider.value);
    const ma = parseFloat(maSlider.value);
    kvValue.textContent = kv + ' kV';
    maValue.textContent = ma + ' mA';

    // Envelope
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(300, 160, 110, Math.PI * 0.85, Math.PI * 2.15);
    ctx.moveTo(300 - 110 * Math.cos(Math.PI * 0.15), 160 - 110 * Math.sin(Math.PI * 0.15));
    ctx.lineTo(120, 130);
    ctx.lineTo(120, 190);
    ctx.lineTo(300 - 110 * Math.cos(Math.PI * 0.15), 160 + 110 * Math.sin(Math.PI * 0.15));
    
    ctx.moveTo(300 + 110 * Math.cos(Math.PI * 0.15), 160 - 110 * Math.sin(Math.PI * 0.15));
    ctx.lineTo(480, 130);
    ctx.lineTo(480, 190);
    ctx.lineTo(300 + 110 * Math.cos(Math.PI * 0.15), 160 + 110 * Math.sin(Math.PI * 0.15));
    ctx.stroke();

    // Window
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(270, 270);
    ctx.lineTo(330, 270);
    ctx.stroke();

    // Cathode block
    ctx.fillStyle = '#334155';
    ctx.fillRect(130, 145, 50, 30);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(130, 145, 50, 30);

    // Cup
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(195, 160, 18, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(185, 178);
    ctx.lineTo(185, 142);
    ctx.closePath();
    ctx.fill();

    // Filament heater wire
    const hotness = Math.min(255, Math.floor(ma * 2.5));
    ctx.strokeStyle = `rgb(255, ${200 - Math.floor(hotness * 0.5)}, 50)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(188, 153);
    ctx.bezierCurveTo(198, 155, 198, 165, 188, 167);
    ctx.stroke();

    // Anode target block
    ctx.fillStyle = '#334155';
    ctx.fillRect(390, 145, 80, 30);
    
    // Target plate
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(360, 130);
    ctx.lineTo(385, 110);
    ctx.lineTo(385, 210);
    ctx.lineTo(360, 190);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Electron release
    const spawnChance = Math.floor(ma / 15);
    if (Math.random() * 8 < spawnChance) {
      electrons.push(new Electron(190, 155 + Math.random() * 10, 3 + (kv / 20)));
    }

    electrons.forEach((el, index) => {
      el.update();
      el.draw();

      if (el.x >= 370) {
        electrons.splice(index, 1);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(372, el.y - 1, 3, 3);

        if (Math.random() < 0.25) {
          xrayWaves.push(new XrayWave(370, el.y, 2 + (kv / 30)));
        }
      }
    });

    xrayWaves.forEach((wave, index) => {
      wave.update();
      wave.draw();

      if (wave.y > xrayCanvas.height) {
        xrayWaves.splice(index, 1);
      }
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '10px Consolas, monospace';
    ctx.fillText(`EMISSION CURRENT: ${ma} mA`, 15, 360);
    ctx.fillText(`ELECTRON KINETIC ENERGY: ${kv} keV`, 15, 375);

    // Continuous Spectrum
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(420, 270, 160, 110);
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(420, 270, 160, 110);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px -apple-system, sans-serif';
    ctx.fillText("Energy Spectrum", 430, 285);
    ctx.fillText("0", 430, 370);
    ctx.fillText(`${kv} keV`, 525, 370);
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(435, 360);
    const pkX = 435 + (kv * 0.3);
    const edX = 435 + (kv * 1.0);
    ctx.bezierCurveTo(pkX - 5, 310, pkX + 15, 320, edX, 360);
    ctx.stroke();

    if (kv >= 70) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const s1 = 435 + (59 * 1.0);
      const s2 = 435 + (68 * 1.0);
      
      ctx.moveTo(s1, 360);
      ctx.lineTo(s1, 295);
      
      ctx.moveTo(s2, 360);
      ctx.lineTo(s2, 315);
      ctx.stroke();
    }

    requestAnimationFrame(animateXray);
  }

  animateXray();


  // --- 3.0 DIAGNOSTIC IMAGING MODALITIES COMPARATOR ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const modalName = document.getElementById('modalName');
  const modalWorks = document.getElementById('modalWorks');
  const modalPros = document.getElementById('modalPros');
  const modalCons = document.getElementById('modalCons');
  const modalPhysics = document.getElementById('modalPhysics');
  const anatomyCanvas = document.getElementById('anatomyCanvas');
  const slideCompare = document.getElementById('slideCompare');
  const actx = anatomyCanvas.getContext('2d');

  anatomyCanvas.width = 400;
  anatomyCanvas.height = 500;

  const modalityData = {
    xray: {
      name: "Plain Film Radiography",
      works: "An X-ray machine shoots a brief beam of X-rays through the patient's body. Dense bones absorb more X-rays because they contain calcium, which has a high atomic number. Soft tissues let most of the X-rays pass through to the detector. This difference in absorption creates a high-contrast shadow image where bones appear white and soft tissues appear dark.",
      physics: "This method relies on the photoelectric effect. When an X-ray photon hits an atom with many electrons, like calcium, it is completely absorbed. In contrast, it passes easily through lighter atoms like hydrogen and carbon in muscles.",
      pros: ["Very fast, simple to perform, inexpensive, and highly effective for diagnosing bone fractures."],
      cons: ["Uses ionising radiation which can damage cells, and provides very poor contrast for soft tissues."]
    },
    ct: {
      name: "Computed Tomography (CT)",
      works: "A CT scanner rotates an X-ray tube and a detector around the patient to take many cross-sectional images from different angles. A computer then combines these 2D slices to create a 3D model of the internal organs and tissues. This allows doctors to view cross-sections of the body without overlapping structures.",
      physics: "The scanner measures how much the X-ray beam is attenuated (weakened) as it passes through different tissues from different directions. The computer uses these measurements to calculate the density of every small volume element (voxel) in the body.",
      pros: ["Produces highly detailed 3D images, does not have overlapping bones to block the view, and is excellent for detecting internal bleeding and brain trauma quickly."],
      cons: ["Exposes the patient to a much higher dose of ionising radiation than a standard X-ray, and is more expensive."]
    },
    mri: {
      name: "Magnetic Resonance Imaging (MRI)",
      works: "An MRI machine uses a strong magnetic field to align the protons (hydrogen nuclei) in the water molecules of the patient's body. The machine then emits radiofrequency pulses to knock these protons out of alignment. When the pulses stop, the protons realign with the magnetic field and emit radio waves, which the machine detects to build an image.",
      physics: "Different tissues contain different amounts of water, meaning their protons realign at different speeds (called relaxation times). The computer uses these differences to construct highly detailed images of soft tissues.",
      pros: ["Does not use ionising radiation, making it very safe, and offers outstanding detail in soft tissues like the brain and ligaments."],
      cons: ["Takes a long time (up to an hour), requires the patient to stay completely still in a noisy tube, and cannot be used if the patient has metal implants."]
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const modality = btn.dataset.modality;
      updateModalityPanel(modality);
      drawSagittalSlice();
    });
  });

  function updateModalityPanel(key) {
    const data = modalityData[key];
    modalName.textContent = data.name;
    modalWorks.textContent = data.works;
    modalPhysics.textContent = data.physics;

    modalPros.innerHTML = '';
    data.pros.forEach(pro => {
      const li = document.createElement('li');
      li.textContent = pro;
      modalPros.appendChild(li);
    });

    modalCons.innerHTML = '';
    data.cons.forEach(con => {
      const li = document.createElement('li');
      li.textContent = con;
      modalCons.appendChild(li);
    });
  }

  function drawSagittalSlice() {
    actx.clearRect(0, 0, anatomyCanvas.width, anatomyCanvas.height);
    const val = parseFloat(slideCompare.value);
    const divX = (val / 100) * anatomyCanvas.width;

    drawHeadAnatomy('mri');

    actx.save();
    actx.beginPath();
    actx.rect(divX, 0, anatomyCanvas.width - divX, anatomyCanvas.height);
    actx.clip();
    
    const activeBtn = document.querySelector('.tab-btn.active');
    const curMod = activeBtn ? activeBtn.dataset.modality : 'ct';
    drawHeadAnatomy(curMod === 'mri' ? 'ct' : curMod);
    actx.restore();

    actx.strokeStyle = '#2563eb';
    actx.lineWidth = 2;
    actx.beginPath();
    actx.moveTo(divX, 0);
    actx.lineTo(divX, anatomyCanvas.height);
    actx.stroke();

    actx.fillStyle = '#ffffff';
    actx.font = '10px monospace';
    actx.fillText(`[ WIPE: ${val}% ]`, divX > 200 ? divX - 85 : divX + 10, 20);
  }

  function drawHeadAnatomy(type) {
    const w = anatomyCanvas.width;
    const h = anatomyCanvas.height;

    actx.fillStyle = '#0f172a';
    actx.fillRect(0, 0, w, h);

    if (type === 'mri') {
      actx.strokeStyle = '#334155';
      actx.lineWidth = 6;
      drawHeadPath();
      actx.stroke();

      actx.fillStyle = '#1e293b';
      actx.beginPath();
      actx.arc(200, 185, 80, 0, Math.PI * 2);
      actx.fill();
      
      actx.strokeStyle = '#475569';
      actx.lineWidth = 1.5;
      for (let r = 25; r < 75; r += 15) {
        actx.beginPath();
        actx.arc(200, 185, r, 0, Math.PI * 2);
        actx.stroke();
      }

      actx.fillStyle = '#334155';
      actx.beginPath();
      actx.ellipse(135, 255, 28, 18, Math.PI/6, 0, Math.PI * 2);
      actx.fill();

      actx.fillStyle = '#f8fafc';
      actx.beginPath();
      actx.moveTo(148, 270);
      actx.quadraticCurveTo(158, 360, 168, 480);
      actx.lineTo(152, 480);
      actx.quadraticCurveTo(142, 360, 132, 270);
      actx.closePath();
      actx.fill();

      actx.fillStyle = '#0f172a';
      actx.beginPath();
      actx.ellipse(200, 175, 15, 8, -Math.PI/6, 0, Math.PI * 2);
      actx.fill();

    } else if (type === 'ct') {
      actx.strokeStyle = '#ffffff';
      actx.lineWidth = 10;
      drawHeadPath();
      actx.stroke();

      actx.fillStyle = '#475569';
      actx.beginPath();
      actx.arc(200, 185, 80, 0, Math.PI * 2);
      actx.fill();

      actx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        actx.fillRect(132, 285 + i * 38, 20, 22);
      }

      actx.fillStyle = '#000000';
      actx.beginPath();
      actx.ellipse(235, 225, 10, 18, -Math.PI/6, 0, Math.PI * 2);
      actx.fill();

      actx.fillStyle = '#ef4444';
      actx.beginPath();
      actx.arc(220, 150, 18, 0, Math.PI * 2);
      actx.fill();
      
      actx.fillStyle = '#ffffff';
      actx.font = '8px monospace';
      actx.fillText("SUBDURAL HEMATOMA (BLEED)", 185, 125);

    } else if (type === 'xray') {
      actx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      actx.lineWidth = 8;
      drawHeadPath();
      actx.stroke();

      actx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      actx.lineWidth = 2;
      actx.beginPath();
      actx.arc(200, 185, 78, 0, Math.PI, true);
      actx.moveTo(135, 270);
      actx.lineTo(240, 270);
      actx.stroke();

      actx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 5; i++) {
        actx.fillRect(132, 285 + i * 38, 18, 20);
      }

      actx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 5; i++) {
        actx.fillRect(235 - i * 5, 260, 3, 5);
        actx.fillRect(235 - i * 5, 267, 3, 5);
      }

      actx.strokeStyle = '#f97316';
      actx.lineWidth = 2;
      actx.beginPath();
      actx.moveTo(212, 305);
      actx.lineTo(222, 318);
      actx.lineTo(218, 328);
      actx.stroke();
      
      actx.fillStyle = '#f97316';
      actx.font = '8px monospace';
      actx.fillText("MANDIBLE FRACTURE LINE", 195, 345);
    }
  }

  function drawHeadPath() {
    actx.beginPath();
    actx.arc(200, 185, 90, Math.PI * 1.1, Math.PI * 1.9, false);
    actx.lineTo(265, 225);
    actx.lineTo(275, 242);
    actx.lineTo(248, 258);
    actx.lineTo(258, 278);
    actx.lineTo(262, 305);
    actx.lineTo(218, 330);
    actx.lineTo(190, 480);
    actx.moveTo(122, 240);
    actx.lineTo(132, 335);
    actx.lineTo(142, 480);
  }

  slideCompare.addEventListener('input', drawSagittalSlice);
  drawSagittalSlice();


  // --- 4.0 MEDICAL RADIOISOTOPES DASHBOARD ---
  const isotopeData = {
    tc99m: {
      name: "Technetium-99m",
      symbol: "⁹⁹ᵐTc",
      halfLife: "6.0 hours",
      decayMode: "Gamma decay (Isomeric Transition, 140 keV)",
      source: "Nuclear Reactor (decay product of molybdenum-99)",
      uses: "Bone scans, heart blood flow imaging, and brain tracer scans.",
      description: "Technetium-99m is used in most nuclear medicine scans because it emits gamma rays that are easy to detect and has a short half-life of about six hours. This provides clear images while limiting the time a patient remains radioactive. The 140 keV gamma rays have enough energy to pass through the body to the detector without causing significant ionisation inside the patient.",
      badge: "tag-blue"
    },
    f18: {
      name: "Fluorine-18",
      symbol: "¹⁸F",
      halfLife: "109.8 minutes",
      decayMode: "Beta plus (Positron emission, 633 keV)",
      source: "Cyclotron (bombarding oxygen-18 target with protons)",
      uses: "Positron Emission Tomography (PET) scans for cancer detection.",
      description: "Fluorine-18 is attached to a sugar molecule (glucose) and injected into the body. Active cancer cells absorb this sugar rapidly because they have a high metabolic rate. When Fluorine-18 decays, it emits a positron (a beta-plus particle). This positron immediately collides with a nearby electron, causing them to annihilate and produce two gamma rays traveling in opposite directions, which the PET scanner detects to locate the tumor.",
      badge: "tag-blue"
    },
    i131: {
      name: "Iodine-131",
      symbol: "¹³¹I",
      halfLife: "8.02 days",
      decayMode: "Beta minus (Therapeutic, 606 keV max) & Gamma (Imaging, 364 keV)",
      source: "Nuclear Reactor (neutron bombardment of tellurium-130)",
      uses: "Treating thyroid cancer and hyperthyroidism.",
      description: "The thyroid gland naturally absorbs iodine from the bloodstream. When a patient swallows Iodine-131, the thyroid concentrates it. As the isotope decays, it emits beta-minus particles (electrons) that travel only a few millimeters. This allows the radiation to destroy diseased thyroid cells locally without damaging other organs, while the emitted gamma rays allow doctors to track where the iodine went.",
      badge: "tag-blue"
    },
    co60: {
      name: "Cobalt-60",
      symbol: "⁶⁰Co",
      halfLife: "5.27 years",
      decayMode: "Beta minus decay & subsequent high-energy Gamma emission (1.17 and 1.33 MeV)",
      source: "Nuclear Reactor (bombarding stable cobalt-59 with neutrons)",
      uses: "External beam radiation therapy (Gamma Knife) and sterilising medical equipment.",
      description: "Cobalt-60 is a highly radioactive metal that decays by emitting beta-minus particles, followed by two high-energy gamma rays. In external beam radiation therapy, doctors focus these gamma rays from many different angles onto a tumor. The radiation damages the DNA of the cancer cells so they cannot reproduce, while the surrounding healthy tissue receives a much lower dose.",
      badge: "tag-blue"
    }
  };

  const isoBtns = document.querySelectorAll('.iso-btn');
  const isoTitle = document.getElementById('isoTitle');
  const isoSymbol = document.getElementById('isoSymbol');
  const isoTypeTag = document.getElementById('isoTypeTag');
  const isoHalfLife = document.getElementById('isoHalfLife');
  const isoSource = document.getElementById('isoSource');
  const isoDecay = document.getElementById('isoDecay');
  const isoUses = document.getElementById('isoUses');
  const isoDesc = document.getElementById('isoDesc');

  isoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isoBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const key = btn.dataset.isotope;
      updateIsotopeDashboard(key);
    });
  });

  function updateIsotopeDashboard(key) {
    const data = isotopeData[key];
    isoTitle.textContent = data.name;
    isoSymbol.textContent = data.symbol;
    isoHalfLife.textContent = data.halfLife;
    isoSource.textContent = data.source;
    isoDecay.textContent = data.decayMode;
    isoUses.textContent = data.uses;
    isoDesc.textContent = data.description;
    
    isoTypeTag.textContent = data.decayMode.split(' ')[0] + ' emitter';
    isoTypeTag.className = `tag ${data.badge}`;
  }


  // --- 5.0 RADIATION DOSIMETRY & ALARA FRAMEWORK ---
  const doseRows = document.querySelectorAll('.dose-row');
  const doseNameDisplay = document.getElementById('doseNameDisplay');
  const doseValDisplay = document.getElementById('doseValDisplay');
  const doseBgEquiv = document.getElementById('doseBgEquiv');
  const doseFlightEquiv = document.getElementById('doseFlightEquiv');
  const riskIndicatorDot = document.getElementById('riskIndicatorDot');
  const riskLabel = document.getElementById('riskLabel');
  
  const balanceBtns = document.querySelectorAll('.balance-btn');
  const scalePanLeft = document.getElementById('scalePanLeft');
  const scalePanRight = document.getElementById('scalePanRight');

  const doseDetails = {
    extremity: {
      name: "Extremity X-Ray",
      value: "1.5 µSv",
      bgTime: "about 4.5 Hours",
      flights: "about 0.2 cross-country flights",
      percentage: 1.5,
      riskPos: "2%",
      riskName: "Negligible",
      riskColor: "var(--color-nonionizing)"
    },
    mammogram: {
      name: "Mammography Study",
      value: "400 µSv (0.4 mSv)",
      bgTime: "about 7 Weeks",
      flights: "about 53 cross-country flights",
      percentage: 25,
      riskPos: "22%",
      riskName: "Very Low",
      riskColor: "var(--color-nonionizing)"
    },
    spine: {
      name: "Lumbar Spine X-Ray",
      value: "1,000 µSv (1 mSv)",
      bgTime: "about 6 Months",
      flights: "about 133 cross-country flights",
      percentage: 55,
      riskPos: "48%",
      riskName: "Low",
      riskColor: "var(--text-muted)"
    },
    ctscan: {
      name: "Chest/Abdomen CT Scan",
      value: "10,000 µSv (10 mSv)",
      bgTime: "about 3.3 Years",
      flights: "about 1,333 cross-country flights",
      percentage: 100,
      riskPos: "92%",
      riskName: "Moderate",
      riskColor: "var(--color-ionizing)"
    }
  };

  doseRows.forEach(row => {
    row.addEventListener('click', () => {
      doseRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      const key = row.dataset.dose;
      updateDoseDisplay(key);
    });
  });

  function updateDoseDisplay(key) {
    const data = doseDetails[key];
    doseNameDisplay.textContent = data.name;
    doseValDisplay.textContent = data.value;
    doseBgEquiv.textContent = data.bgTime;
    doseFlightEquiv.textContent = data.flights;

    riskIndicatorDot.style.left = data.riskPos;
    riskLabel.textContent = data.riskName;
    riskLabel.style.color = data.riskColor;
  }

  setTimeout(() => {
    doseRows.forEach(row => {
      const key = row.dataset.dose;
      const bar = row.querySelector('.dose-row-bar');
      if (bar) {
        bar.style.width = `${doseDetails[key].percentage}%`;
      }
    });
  }, 200);

  balanceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      balanceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const balanceType = btn.dataset.balance;
      updateALARAVisualization(balanceType);
    });
  });

  function updateALARAVisualization(type) {
    if (type === 'unbalanced') {
      scalePanLeft.style.borderColor = 'var(--color-ionizing)';
      scalePanLeft.style.opacity = '1.0';
      scalePanRight.style.borderColor = 'var(--border-color)';
      scalePanRight.style.opacity = '0.4';
    } else if (type === 'benefit') {
      scalePanLeft.style.borderColor = 'var(--border-color)';
      scalePanLeft.style.opacity = '0.5';
      scalePanRight.style.borderColor = 'var(--color-nonionizing)';
      scalePanRight.style.opacity = '1.0';
    } else {
      scalePanLeft.style.borderColor = 'var(--border-color)';
      scalePanLeft.style.opacity = '0.85';
      scalePanRight.style.borderColor = 'var(--border-color)';
      scalePanRight.style.opacity = '0.85';
    }
  }

  updateALARAVisualization('benefit');
});
