import asyncio
from playwright.async_api import async_playwright

html_content = """<!DOCTYPE html>
<html lang="es-419">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>De Anime a Live-Action con IA — Curso Completo</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        :root {
            --primary: #4f46e5;
            --secondary: #ec4899;
            --bg: #ffffff;
            --bg-card: #f8fafc;
            --text: #0f172a;
            --text-muted: #475569;
            --border: #e2e8f0;
            --success: #16a34a;
            --warning: #d97706;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #ffffff;
            color: var(--text);
            line-height: 1.7;
            font-size: 11pt;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
        }

        .course-header {
            background: linear-gradient(135deg, #4f46e5, #ec4899);
            padding: 35px 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            text-align: center;
            color: white;
            page-break-after: avoid;
        }

        .course-header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
        }

        .course-header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        .module {
            margin-bottom: 30px;
            border: 1px solid var(--border);
            border-radius: 10px;
            overflow: hidden;
            page-break-inside: avoid;
        }

        .module-header {
            background: var(--primary);
            color: white;
            padding: 16px 20px;
            font-size: 1.3rem;
            font-weight: 700;
        }

        .module-content {
            padding: 20px;
        }

        .lesson {
            margin-bottom: 25px;
            padding: 20px;
            background: var(--bg-card);
            border-radius: 8px;
            border: 1px solid var(--border);
            page-break-inside: avoid;
        }

        .lesson-header {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border);
        }

        .lesson h2 {
            font-size: 1.25rem;
            color: var(--primary);
        }

        .lesson-content {
            font-size: 10.5pt;
            line-height: 1.7;
        }

        .lesson-content p {
            margin-bottom: 12px;
        }

        .lesson-content h3 {
            font-size: 1.1rem;
            margin: 18px 0 10px;
            color: var(--secondary);
        }

        .lesson-content ul, .lesson-content ol {
            margin: 12px 0;
            padding-left: 25px;
        }

        .lesson-content li {
            margin-bottom: 8px;
        }

        .lesson-content blockquote {
            background: #f1f5f9;
            border-left: 4px solid var(--primary);
            padding: 12px 16px;
            margin: 15px 0;
            border-radius: 4px;
        }

        .lesson-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .lesson-content th, .lesson-content td {
            border: 1px solid var(--border);
            padding: 10px 12px;
            text-align: left;
        }

        .lesson-content th {
            background: var(--primary);
            color: white;
            font-weight: 600;
        }

        .lesson-content tr:nth-child(even) {
            background: rgba(99, 102, 241, 0.05);
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9pt;
            color: var(--text-muted);
            border-top: 1px solid var(--border);
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="course-header">
            <h1>🎬 De Anime a Live-Action con IA</h1>
            <p>El método paso a paso para convertir una escena de anime en una toma realista filmada — sin equipo, sin crew.</p>
        </header>

        <main class="course-content">
            <div class="module">
                <div class="module-header">
                    Módulo 1: De Anime a Live-Action — Guía Completa
                </div>
                <div class="module-content">
                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 1: Bienvenida y Qué Lograrás</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>Bienvenida al curso</h3>
                            <p>Esta guía te lleva desde cero hasta tu primera toma live-action generada y lista para publicar. No vamos a saltarnos nada: vamos a recorrer juntos los únicos dos movimientos que realmente importan, en el orden correcto.</p>
                            <ul>
                                <li><strong>Parte 1 — Generar tu imagen:</strong> Elige una escena, extrae una imagen de referencia (keyframe) y conviértela en un visual live-action realista.</li>
                                <li><strong>Parte 2 — Generar tu video:</strong> Toma esa imagen y dale vida: cámara, iluminación y performance — sin que la IA se desmorone.</li>
                            </ul>
                            <p>Este es el exacto flujo de trabajo que uso todos los días en el estudio. Nada teórico: copias, pegas y generas.</p>
                            <blockquote>
                                <strong>Principiantes completos:</strong> Si puedes descargar un video y copiar-pegar texto, tienes el nivel necesario. No se requieren habilidades de edición o 3D para este primer paso.
                            </blockquote>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 2: El Principio en 30 Segundos</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>Anime → Live-action: cómo funciona</h3>
                            <p>Un video es una secuencia de imágenes. Por lo tanto, no "conviertes" una escena de una sola vez: trabajas <strong>imagen por imagen</strong>. El camino es siempre el mismo:</p>
                            <ul>
                                <li><strong>Eliges:</strong> Un clip de anime que te inspire.</li>
                                <li><strong>Extraes:</strong> Un fotograma nítido de la escena.</li>
                                <li><strong>La IA lo hace real:</strong> Parte 1 de esta guía.</li>
                                <li><strong>La IA lo anima:</strong> Parte 2 de esta guía.</li>
                            </ul>
                            <p>Esta guía cubre los dos pasos clave — <strong>03</strong> (generar la imagen) y <strong>04</strong> (generar el video). Ahí es donde se decide el 90% del resultado.</p>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 3: Tu Stack Mínimo</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>Una sola herramienta para empezar</h3>
                            <p>Olvídate de la lista de 15 aplicaciones. Para esta primera guía, todo lo que necesitas es esto:</p>
                            <ul>
                                <li><strong>Una herramienta IA todo-en-uno:</strong> Se recomienda <strong>Higgsfield</strong> (modelo Nano Banana para imagen + generación de video integrada). Alternativas: TapNow / Seedance.</li>
                                <li><strong>Una forma de capturar un fotograma:</strong> Un reproductor de video y la tecla de captura de pantalla son suficientes.</li>
                                <li><strong>Un editor básico:</strong> La app de edición de tu teléfono alcanza para unir las tomas.</li>
                            </ul>
                            <blockquote>
                                La corrección de color, upscaling y conversión de FPS separan un video "bueno" de uno "firmado". Eso lo dejamos para el curso avanzado. Aquí buscamos tu primer clip <strong>terminado y publicado</strong>.
                            </blockquote>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 4: Parte 1 — Generar tu Imagen</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>Generar tu imagen</h3>
                            <p>Elige una escena con una <strong>composición fuerte</strong>: un personaje de frente o perfil, un plano general impactante, una mirada. Por ahora, evita tomas cargadas de acción o muchos personajes — cuanto más simple, más fiel será la IA.</p>
                            <ul>
                                <li>Pausa el video en el momento exacto que deseas recrear.</li>
                                <li>Captura un fotograma <strong>nítido</strong> (sin motion blur). Ese es tu <strong>keyframe</strong>.</li>
                                <li>Mantén buena resolución — una imagen muy pequeña genera un resultado borroso.</li>
                            </ul>
                            <p>En tu herramienta, tienes <strong>tres formas</strong> de generar tu imagen live-action.</p>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 5: Tres Formas de Generar</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>A · Imagen → Live-action — La más simple</h3>
                            <p>Subes tu keyframe y pides una versión live-action realista. La IA mantiene la composición y la pose, cambiando el estilo anime por algo real.</p>

                            <h3>B · Imagen + Referencia de personaje — Para consistencia</h3>
                            <p>Subes tu keyframe y también una imagen de referencia del rostro/personaje. La IA ubica ese personaje en la escena. Esencial para mantener el mismo actor en varias tomas.</p>

                            <h3>C · Texto → Imagen — Construir desde cero</h3>
                            <p>¿No tienes keyframe? Describes la escena por completo en texto y la IA la crea. Da más libertad, pero requiere un prompt más detallado.</p>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 6: Estructura de un Buen Prompt</h2>
                        </div>
                        <div class="lesson-content">
                            <p>Un buen prompt no es una oración vaga. Es una <strong>lista de bloques claros</strong>, ordenados por importancia:</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Bloque</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>SUBJECT</strong></td>
                                        <td>Quién o qué está en la imagen.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>ACTION / POSE</strong></td>
                                        <td>Qué hace el personaje, su actitud, hacia dónde mira.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>FRAMING</strong></td>
                                        <td>Plano general, primer plano, picado/contrapicado y ángulo de cámara.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>LIGHT</strong></td>
                                        <td>Fuente de luz, dirección, ambiente (luz suave de atardecer, neón frío...).</td>
                                    </tr>
                                    <tr>
                                        <td><strong>MOOD</strong></td>
                                        <td>Atmósfera: realista, cinematográfico, desaturado, grano fino de película.</td>
                                    </tr>
                                    <tr>
                                        <td><strong>AVOID</strong></td>
                                        <td>Lo que NO quieres: dibujo, cartoon, distorsiones, texto en pantalla.</td>
                                    </tr>
                                </tbody>
                            </table>
                            <blockquote>
                                <strong>Regla de oro con imagen de referencia:</strong> Si subiste una foto de referencia del personaje, NUNCA lo describas en el prompt (ni cabello, ni ropa, ni rostro). La referencia es suficiente; describirlo genera conflictos que distorsionan el resultado.
                            </blockquote>
                            <blockquote>
                                <strong>Prompt autocontenido:</strong> Cada prompt debe ser independiente. La IA empieza de cero en cada generación. Todo lo importante vive en ESTE prompt.
                            </blockquote>
                        </div>
                    </div>

                    <div class="lesson">
                        <div class="lesson-header">
                            <h2>Lección 7: Prompts de Ejemplo y Conclusión</h2>
                        </div>
                        <div class="lesson-content">
                            <h3>3 Prompts de Imagen Listos para Copiar</h3>
                            <p><strong>Prompt 1 (Retrato Cinematográfico):</strong><br>
                            <code>Cinematic medium close-up shot of a young anime warrior character transposed to live-action, subtle determined expression, looking slightly off-camera, dramatic golden hour side lighting, soft depth of field, 35mm film aesthetic, photorealistic texture, highly detailed --no drawing, illustration, 3d render, text</code></p>

                            <p style="margin-top: 15px;"><strong>Prompt 2 (Plano General de Paisaje/Acción):</strong><br>
                            <code>Cinematic wide shot of a solitary figure in a dark futuristic alley, wet pavement reflecting neon lights, atmospheric fog, moody blue and purple color grading, shot on 65mm camera, hyperrealistic detail --no anime, cartoon, sketch</code></p>

                            <p style="margin-top: 15px;"><strong>Prompt 3 (Escena de Diálogo Intenso):</strong><br>
                            <code>Over the shoulder shot of two characters in a high tension dialogue, shallow depth of field, soft indoor lighting, natural skin textures, raw cinematic still --no low quality, blurry, 3d model</code></p>

                            <h3 style="margin-top: 25px;">¡Felicidades!</h3>
                            <p>Ahora tienes todas las bases para transformar tus escenas de anime favoritas en impresiones cinematográficas live-action utilizando Inteligencia Artificial.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <p>Curso Completo: De Anime a Live-Action con IA — Documento generado para lectura y referencia offline.</p>
        </footer>
    </div>
</body>
</html>
"""

with open("course_export.html", "w", encoding="utf-8") as f:
    f.write(html_content)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("file://" + "/app/course_export.html")
        await page.pdf(
            path="De_Anime_a_Live_Action_Curso_Completo.pdf",
            format="A4",
            print_background=True,
            margin={"top": "15mm", "bottom": "15mm", "left": "15mm", "right": "15mm"}
        )
        await browser.close()
        print("PDF generated successfully.")

asyncio.run(main())
