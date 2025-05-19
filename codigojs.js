function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const palabras = ["TE AMO"];
    const canvas = document.querySelector(".canvasMatrix");
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const cols = Math.floor(w / 60);
    const ypos = Array(cols).fill(0);

    let scale = 1;
    let heartPath = new Path2D();

    function updateHeartPath() {
      heartPath = new Path2D();
      heartPath.moveTo(0, -40);
      heartPath.bezierCurveTo(-50, -90, -120, 0, 0, 60);
      heartPath.bezierCurveTo(120, 0, 50, -90, 0, -40);
    }

    function drawHeart() {
      const t = Date.now() / 500;
      scale = 1.7 + 0.2 * Math.sin(t);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);

      updateHeartPath(); // recrear el path con cada escala

      ctx.shadowBlur = 16;
      ctx.shadowColor = "#ff69b4";
      ctx.fillStyle = "#ff69b4";
      ctx.fill(heartPath);

      ctx.restore();
    }

    function drawMatrix() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "12pt monospace";
      ctx.fillStyle = "#FF0000";
      ctx.shadowBlur = 0;

      const t = Date.now() / 500;
      scale = 1 + 0.2 * Math.sin(t);

      // Guardamos el path del corazón escalado para usarlo como zona de exclusión
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      updateHeartPath(); // actualizar el path
      ctx.restore();

      ypos.forEach((y, i) => {
        const x = i * 60;

        // Coordenadas a transformar para comprobar contra el corazón
        const localX = (x - w / 2) / scale;
        const localY = (y - h / 2) / scale;

        const isInHeart = ctx.isPointInPath(heartPath, localX, localY);

        if (!isInHeart) {
          const palabra = palabras[getRandomInt(palabras.length)];
          ctx.fillText(palabra, x, y);
        }

        if (y > h + Math.random() * 10000) {
          ypos[i] = 0;
        } else {
          ypos[i] = y + 20;
        }
      });

      drawHeart(); // dibujamos al final encima de todo
    }

    setInterval(drawMatrix, 45);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });