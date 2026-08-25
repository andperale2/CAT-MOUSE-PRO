import asyncio
from playwright.async_api import async_playwright

html_content = """<!DOCTYPE html>
<html lang="es-419">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>De Anime a Live-Action con IA — Curso Completo Narrado</title>
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #ec4899;
            --bg: #0f172a;
            --bg-card: #1e293b;
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --border: #334155;
            --success: #22c55e;
            --warning: #f59e0b;
            --narrating-bg: #1e3a5f;
            --narrating-border: #3b82f6;
            --narrating-text: #60a5fa;
            --completed-bg: #064e3b;
            --completed-border: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.7;
            padding: 20px;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
        }

        .course-header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            padding: 35px 30px;
            border-radius: 16px;
            margin-bottom: 30px;
            text-align: center;
            color: #ffffff;
        }

        .course-header h1 {
            font-size: 2.2rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .course-header p {
            font-size: 1.15rem;
            opacity: 0.95;
        }

        .module {
            margin-bottom: 30px;
            border: 2px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            background: var(--bg-card);
        }

        .module-header {
            background: var(--primary);
            padding: 18px 25px;
            font-size: 1.4rem;
            font-weight: 700;
            color: white;
        }

        .module-content {
            padding: 25px;
        }

        .lesson {
            margin-bottom: 30px;
            padding: 22px;
            background: var(--bg);
            border-radius: 10px;
            border: 1px solid var(--border);
            page-break-inside: avoid;
        }

        .lesson-header {
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--border);
        }

        .lesson h2 {
            font-size: 1.35rem;
            color: var(--narrating-text);
        }

        .lesson-content {
            font-size: 1rem;
            line-height: 1.75;
        }

        .lesson-content p {
            margin-bottom: 14px;
        }

        .lesson-content h3 {
            font-size: 1.18rem;
            margin: 22px 0 12px;
            color: var(--secondary);
        }

        .lesson-content ul, .lesson-content ol {
            margin: 14px 0;
            padding-left: 25px;
        }

        .lesson-content li {
            margin-bottom: 8px;
        }

        .lesson-content blockquote {
            background: var(--bg-card);
            border-left: 4px solid var(--primary);
            padding: 14px 18px;
            margin: 18px 0;
            border-radius: 6px;
        }

        .subtitle-segment {
            padding: 8px 12px;
            border-radius: 8px;
            margin: 12px 0;
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .narration-box {
            background: rgba(99, 102, 241, 0.12);
            border-left: 4px solid var(--primary);
            padding: 12px 16px;
            margin-top: 10px;
            border-radius: 0 6px 6px 0;
            color: #cbd5e1;
            font-size: 0.98rem;
        }

        .narration-label {
            font-weight: 700;
            color: var(--narrating-text);
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="course-header">
            <h1>🎬 De Anime a Live-Action con IA</h1>
            <p>El método paso a paso para convertir una escena de anime en una toma realista filmada — sin equipo, sin crew.</p>
        </header>

        <main class="course-content" id="courseContent">
            <div class="module" id="module1">
                <div class="module-header">
                    Módulo 1: De Anime a Live-Action — Guía Completa
                </div>
                <div class="module-content" id="module1Content">
                </div>
            </div>
        </main>
    </div>

    <script>
        const courseData = {
            title: "De Anime a Live-Action con IA",
            modules: [
                {
                    id: "module1",
                    title: "Módulo 1: De Anime a Live-Action — Guía Completa",
                    lessons: [
                        {
                            id: "lesson1",
                            title: "Bienvenida y Qué Lograrás",
                            segments: [
                                { type: "heading", text: "Bienvenida al curso", narration: "Bienvenido a este curso completo sobre cómo convertir escenas de anime en tomas live-action realistas usando inteligencia artificial. En este curso vas a aprender el método exacto que uso todos los días en el estudio para transformar anime en video realista, sin necesidad de equipo costoso ni un equipo de producción." },
                                { type: "paragraph", text: "This guide takes you from **zero** to **your first live-action shot, generated and ready to post**. No skimming: we walk through the only two moves that really matter, in order.", narration: "Esta guía te lleva desde cero hasta tu primera toma live-action generada y lista para publicar. No vamos a saltarnos nada: vamos a recorrer juntos los únicos dos movimientos que realmente importan, en el orden correcto." },
                                { type: "list", text: "- **Part 1 — Generate your image.** Pick a scene, pull a reference image from it (the keyframe), and turn it into a realistic live-action visual.\n- **Part 2 — Generate your video.** Take that image and bring it to life: camera, light, performance — without the AI falling apart.", narration: "Vamos a dividir esto en dos partes claras. En la primera parte, vas a generar tu imagen: vas a elegir una escena, extraer una imagen de referencia de ella, lo que llamamos el keyframe, y convertirlo en un visual live-action realista. En la segunda parte, vas a generar tu video: vas a tomar esa imagen y darle vida, agregando cámara, iluminación y performance, sin que la inteligencia artificial se desmorone." },
                                { type: "paragraph", text: "This is the exact workflow I use every day at the studio. Nothing theoretical: you copy, you paste, you generate.", narration: "Este es exactamente el mismo flujo de trabajo que uso todos los días en el estudio. Nada de teoría: vas a copiar, pegar y generar. Es práctico desde el primer minuto." },
                                { type: "note", text: "#### Complete beginners.\n\nIf you can download a video and copy-paste some text, you have the level. No editing or 3D skills are required for this first step.", narration: "Y si eres completamente principiante, no te preocupes. Si puedes descargar un video y copiar y pegar texto, ya tienes el nivel necesario. No se requiere ninguna habilidad de edición o 3D para este primer paso. Vamos a empezar desde lo más básico." }
                            ]
                        },
                        {
                            id: "lesson2",
                            title: "El Principio en 30 Segundos",
                            segments: [
                                { type: "heading", text: "Anime → Live-action: cómo funciona", narration: "Ahora vamos a entender el principio fundamental en solo 30 segundos. ¿Cómo funciona exactamente convertir anime a live-action?" },
                                { type: "paragraph", text: "A video is a sequence of images. So you don't \"convert\" a scene in one go: you work **image by image**. The path is always the same.", narration: "Un video es simplemente una secuencia de imágenes. Entonces no vas a convertir una escena completa de una sola vez: vas a trabajar imagen por imagen. El camino es siempre el mismo, y eso es lo que hace que este proceso sea predecible y repetible." },
                                { type: "list", text: "- **You pick**: An anime clip that inspires you.\n- **You extract**: A sharp still from the scene.\n- **AI makes it real**: Part 1 of this guide.\n- **AI animates it**: Part 2 of this guide.", narration: "El proceso tiene cuatro pasos claros. Primero, eliges un clip de anime que te inspire. Segundo, extraes un fotograma nítido de esa escena. Tercero, usas inteligencia artificial para hacerlo realista, eso es la primera parte de esta guía. Y cuarto, usas inteligencia artificial para animarlo, que es la segunda parte de la guía." },
                                { type: "paragraph", text: "This guide covers the two highlighted steps — **03** (generate the image) and **04** (generate the video). That's where 90% of the result is decided.", narration: "Esta guía cubre exactamente esos dos pasos resaltados: generar la imagen y generar el video. Y te voy a decir algo importante: ahí es donde se decide el 90% del resultado final. Si dominas estos dos pasos, ya tienes lo más difícil hecho." }
                            ]
                        },
                        {
                            id: "lesson3",
                            title: "Tu Stack Mínimo",
                            segments: [
                                { type: "heading", text: "Una sola herramienta para empezar", narration: "Vamos a hablar de qué necesitas realmente para empezar. Y la buena noticia es que necesitas muy poco." },
                                { type: "paragraph", text: "Forget the list of 15 apps. For this first guide, all you need is this:", narration: "Olvídate de las listas de 15 aplicaciones. Para esta primera guía, todo lo que necesitas es esto:" },
                                { type: "list", text: "- **One all-in-one AI generation tool** — I work in **Higgsfield** (Nano Banana model for the image + built-in video generation). Alternative: TapNow / Seedance. The tool does the image *and* the video, so you stay in one place.\n- **A way to grab a frame** — a video player and the screenshot key are enough to start.\n- **A basic editor** — your phone's editing app is plenty for stitching your shots together.", narration: "Primero, necesitas una herramienta de generación de inteligencia artificial todo en uno. Yo trabajo en Higgsfield, usando el modelo Nano Banana para la imagen más la generación de video integrada. Alternativas: TapNow o Seedance. La herramienta hace la imagen y el video, así que te mantienes en un solo lugar. Segundo, necesitas una forma de capturar un fotograma: un reproductor de video y la tecla de captura de pantalla son suficientes para empezar. Y tercero, un editor básico: la aplicación de edición de tu teléfono es más que suficiente para unir tus tomas." },
                                { type: "note", text: "Because color grading, upscaling and fps conversion are what separate a \"fine\" video from a \"signature\" one. We keep that for the advanced course. Here, we're aiming for your first clip **finished and posted**, not perfection.", narration: "Ahora, ¿por qué no estamos hablando de corrección de color, upscaling o conversión de fps? Porque eso es lo que separa un video 'bien hecho' de uno con 'firma profesional'. Eso lo guardamos para el curso avanzado. Aquí, nuestro objetivo es que tengas tu primer clip terminado y publicado, no la perfección." }
                            ]
                        },
                        {
                            id: "lesson4",
                            title: "Parte 1: Generar tu Imagen",
                            segments: [
                                { type: "heading", text: "Generar tu imagen", narration: "Ahora entramos en la Parte 1: generar tu imagen. Y esto es crítico: todo empieza con la imagen. Si tu keyframe live-action es bueno, tu video también será bueno. Si está mal hecho, ningún prompt de video lo va a salvar. Así que vamos a tomar el tiempo que necesita." },
                                { type: "paragraph", text: "Choose a scene with a **strong composition**: a character facing forward or in profile, a striking wide shot, a gaze. For now, avoid shots packed with action or characters — the simpler it is, the more faithful the AI.", narration: "Lo primero: elige una escena con una composición fuerte. Busca un personaje de frente o de perfil, un plano general impactante, una mirada. Por ahora, evita tomas llenas de acción o muchos personajes. Cuanto más simple sea, más fiel será la inteligencia artificial." },
                                { type: "list", text: "- Pause the video on the exact moment you want to recreate.\n- Capture a **sharp** still (not during motion blur). That's your **keyframe**: the reference image.\n- Keep good resolution — too small an image gives a mushy result.", narration: "Tres pasos prácticos aquí. Primero, pausa el video en el momento exacto que quieres recrear. Segundo, captura un fotograma nítido, no durante el motion blur. Ese es tu keyframe, tu imagen de referencia. Y tercero, mantén buena resolución: una imagen demasiado pequeña da un resultado borroso." },
                                { type: "paragraph", text: "In your tool, you have **three ways** to generate your live image. Click to explore each:", narration: "En tu herramienta, tienes tres formas de generar tu imagen live-action. Vamos a explorar cada una:" }
                            ]
                        },
                        {
                            id: "lesson5",
                            title: "Tres Formas de Generar",
                            segments: [
                                { type: "heading", text: "A · Imagen → Live-action — la más simple", narration: "La primera forma es la más simple: Imagen a Live-action. Subes tu keyframe y pides una versión live-action realista. La inteligencia artificial mantiene la composición y la pose, y cambia el estilo anime por algo real. Perfecto para empezar." },
                                { type: "heading", text: "B · Imagen + referencia de personaje — para consistencia", narration: "La segunda forma es Imagen más referencia de personaje, para consistencia. Subes tu keyframe y también una imagen de referencia del rostro o personaje que quieres. La inteligencia artificial coloca ese personaje en la escena. Es esencial cuando necesitas el mismo actor en varias tomas." },
                                { type: "heading", text: "C · Texto → Imagen — construir desde cero", narration: "La tercera forma es Texto a Imagen, construir desde cero. ¿No tienes keyframe? Describes la escena completamente por escrito y la inteligencia artificial la crea. Da más libertad, pero necesita un prompt más ajustado, que vamos a ver en el próximo paso." }
                            ]
                        },
                        {
                            id: "lesson6",
                            title: "Estructura de un Buen Prompt",
                            segments: [
                                { type: "paragraph", text: "A good prompt isn't a catch-all sentence. It's a **list of clear blocks**, from most important to least:", narration: "Ahora, hablemos de prompts. Un buen prompt no es una frase que intenta decir todo de una vez. Es una lista de bloques claros, del más importante al menos importante. Vamos a ver cada bloque." },
                                { type: "table", text: "| SUBJECT | Who / what is in the image |\n| ACTION / POSE | What the character does, their attitude, where they're looking. |\n| FRAMING | Wide shot, close-up, high angle… and the camera angle. |\n| LIGHT | Source, direction, mood (soft late-day light, cold neon…). |\n| MOOD | The feel: realistic, cinematic, desaturated, fine film grain. |\n| AVOID | What you don't want: drawing, cartoon, distortions, on-screen text. |", narration: "Primero, SUBJECT: quién o qué está en la imagen, a menos que proporciones una referencia, y ahí viene la regla de oro que vamos a ver. Segundo, ACTION o POSE: qué hace el personaje, su actitud, hacia dónde mira. Tercero, FRAMING: plano general, primer plano, ángulo alto, y el ángulo de cámara. Cuarto, LIGHT: fuente, dirección, ambiente, como luz suave de final de día o neón frío. Quinto, MOOD: la sensación, realista, cinematográfico, desaturado, grano de película fino. Y sexto, AVOID: lo que no quieres, como dibujo, cartoon, distorsiones, texto en pantalla." },
                                { type: "note", text: "#### Reference image = NEVER describe the character.\n\nIf you uploaded a reference of the face or character, don't describe it in the prompt (no hair, no outfit, no face). The reference is enough; describing it on top creates conflicts that distort the result. In that case, your prompt only holds the action, framing, light and mood.", narration: "Aquí viene la regla de oro: si subiste una imagen de referencia del rostro o personaje, NUNCA describas al personaje en el prompt. Nada de cabello, nada de outfit, nada de rostro. La referencia es suficiente. Describirlo además crea conflictos que distorsionan el resultado. En ese caso, tu prompt solo contiene la acción, el encuadre, la luz y el ambiente." },
                                { type: "note", text: "#### Self-contained prompt.\n\nEvery prompt must stand on its own. The AI starts from scratch each generation: no \"like the previous shot.\" Everything that matters lives in THIS prompt.", narration: "Otra regla importante: cada prompt debe ser autocontenido. La inteligencia artificial empieza desde cero en cada generación: no hay 'como la toma anterior'. Todo lo que importa vive en ESTE prompt. Así que sé explícito y completo." }
                            ]
                        },
                        {
                            id: "lesson7",
                            title: "Tres Prompts de Imagen Listos para Copiar",
                            segments: [
                                { type: "paragraph", text: "3 image prompts · ready to copy", narration: "Ahora te voy a dar tres prompts de imagen listos para copiar. Puedes usarlos directamente y adaptarlos a tu escena." }
                            ]
                        }
                    ]
                }
            ]
        };

        function renderCourse() {
            const moduleContainer = document.getElementById('module1Content');
            moduleContainer.innerHTML = '';

            courseData.modules[0].lessons.forEach((lesson, lIndex) => {
                const lessonDiv = document.createElement('div');
                lessonDiv.className = 'lesson';
                lessonDiv.id = lesson.id;

                let contentHtml = `<div class="lesson-header">
                    <h2>${lesson.title}</h2>
                </div><div class="lesson-content">`;

                lesson.segments.forEach((seg, sIndex) => {
                    contentHtml += `<div class="subtitle-segment" id="seg-${lIndex}-${sIndex}">`;
                    if (seg.type === 'heading') {
                        contentHtml += `<h3>${seg.text}</h3>`;
                    } else if (seg.type === 'paragraph') {
                        contentHtml += `<p>${formatMarkdown(seg.text)}</p>`;
                    } else if (seg.type === 'list') {
                        contentHtml += `<ul>${seg.text.split('\n').map(item => `<li>${formatMarkdown(item.replace(/^-\s*/, ''))}</li>`).join('')}</ul>`;
                    } else if (seg.type === 'note') {
                        contentHtml += `<blockquote>${formatMarkdown(seg.text)}</blockquote>`;
                    } else if (seg.type === 'table') {
                        contentHtml += `<p><strong>Guía de Bloques de Prompt:</strong></p><ul>` +
                        `<li><strong>SUBJECT:</strong> Quién / qué está en la imagen</li>` +
                        `<li><strong>ACTION / POSE:</strong> Lo que hace el personaje, actitud, mirada</li>` +
                        `<li><strong>FRAMING:</strong> Plano general, primer plano, ángulo de cámara</li>` +
                        `<li><strong>LIGHT:</strong> Fuente de luz, dirección, ambiente</li>` +
                        `<li><strong>MOOD:</strong> Estilo realista, cinematográfico, grano de película</li>` +
                        `<li><strong>AVOID:</strong> Lo que no quieres (dibujo, cartoon, distorsión)</li></ul>`;
                    }
                    if (seg.narration) {
                        contentHtml += `<div class="narration-box"><span class="narration-label">🎙️ Guion Narrado (Audio):</span>${seg.narration}</div>`;
                    }
                    contentHtml += `</div>`;
                });

                contentHtml += `</div>`;
                lessonDiv.innerHTML = contentHtml;
                moduleContainer.appendChild(lessonDiv);
            });
        }

        function formatMarkdown(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/#### (.*?)\n/g, '<strong>$1</strong><br>');
        }

        renderCourse();
    </script>
</body>
</html>"""

async def export():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html_content)
        await page.pdf(
            path='De_Anime_a_Live_Action_con_IA_Curso_Completo.pdf',
            format='A4',
            margin={'top': '15mm', 'bottom': '15mm', 'left': '15mm', 'right': '15mm'},
            print_background=True
        )
        await browser.close()
        print('PDF generated successfully!')

if __name__ == '__main__':
    asyncio.run(export())
