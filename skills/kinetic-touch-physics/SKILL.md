---
name: kinetic-touch-physics
description: Diseño y programación de microinteracciones fluidas a 120 FPS mediante física matemática de resortes (damped harmonic oscillator), manipulación táctil 1:1, transferencia de inercia gestual y componentes de autor (Drawers, Toasts apilables, Modales elásticos) al estilo Emil Kowalski (animations.dev / Vaul / Sonner / Apple HIG).
---

# Skill: Kinetic Touch Physics (Emil Kowalski / Apple HIG 120 FPS Standard)

Usa esta skill siempre que el usuario pida:
1. Crear o refactorizar **microinteracciones, animaciones de interfaz o componentes táctiles** con física real de resortes (*springs*).
2. Construir componentes de autor como **Drawers (hojas deslizantes inferiores tipo Vaul)**, **Toasts apilables con inercia (tipo Sonner)**, o **modales de confirmación con resistencia elástica**.
3. Reemplazar curvas de animación CSS robóticas (`ease-in`, `linear`) por **física de oscilador armónico amortiguado** a 120 FPS en displays ProMotion / Retina.
4. Implementar **manipulación táctil directa 1:1** con arrastre por puntero, resistencia elástica (*rubber banding*) y transferencia de velocidad inercial (*velocity fling*).

---

## 🧮 1. Núcleo Matemático: Física de Resortes (Oscilador Armónico Amortiguado)

Queda prohibido usar duraciones fijas lineales (`transition: all 0.3s ease-in-out`). Todo movimiento orgánico debe regirse por la ecuación diferencial de segundo orden:

$$m \frac{d^2 x}{dt^2} + c \frac{dx}{dt} + k(x - x^*) = 0$$

Donde:
* $m$ = Masa del elemento (inercia).
* $k$ = Rigidez (*stiffness*) o constante de restitución elástica.
* $c$ = Amortiguamiento (*damping*), que disipa energía para evitar oscilaciones infinitas.

### Parámetros Clave para la Calibración de la UI:
* **Frecuencia natural:** $\omega_0 = \sqrt{\frac{k}{m}}$ (determina la velocidad o vivacidad del resorte).
* **Ratio de amortiguamiento:** $\zeta = \frac{c}{2\sqrt{km}}$:
  * **$\zeta < 1$ (Sub-amortiguado / *Underdamped*):** Rebote elástico visible. Ideal para micro-estados, botones o confirmaciones de éxito ($\zeta \approx 0.70$–$0.82$).
  * **$\zeta = 1$ (Críticamente amortiguado / *Critically Damped*):** La máxima velocidad posible hacia el objetivo **sin sobrepasar jamás el límite** (sin rebote). Ideal para navegación, apertura de cajones o cambios de página ($\zeta = 1.0$).
  * **$\zeta > 1$ (Sobre-amortiguado / *Overdamped*):** Resistencia viscosa pesada. Ideal para arrastres que superan los límites de la pantalla (*rubber banding*).

---

## 👆 2. Manipulación Táctil Directa 1:1 y Transferencia de Velocidad

Para que una interfaz web se sienta como una aplicación nativa de iOS / iPadOS, debe obedecer tres principios biomecánicos:

### A. Seguimiento Vectorial de Velocidad Instantánea ($\vec{v}$)
Durante el arrastre (`pointermove`), se calcula la velocidad del dedo con una ventana deslizante ponderada:
```javascript
const dt = (now - lastTime) / 1000;
if (dt > 0) {
  currentVelocity = (currentY - lastY) / dt; // Píxeles por segundo
}
```

### B. Resistencia Elástica en los Límites (*Rubber Banding*)
Cuando el usuario arrastra más allá del límite permitido (ej. estirar un panel hacia abajo cuando ya está abierto), la distancia se comprime logarítmicamente:
$$y_{\text{visual}} = y_{\text{límite}} + \frac{(y - y_{\text{límite}}) \cdot d}{(y - y_{\text{límite}}) + d}$$
*(Donde $d \approx 180$, produciendo una sensación táctil de muelle tenso).*

### C. Transferencia de Inercia en el Lanzamiento (*Fling / Toss*)
Al soltar el puntero (`pointerup`), **jamás** se arranca la animación desde velocidad cero. Se inyecta `currentVelocity` como condición inicial $\dot{x}(0) = v_0$ en el solver del resorte. Si el usuario desliza con fuerza hacia abajo ($v > 600\text{ px/s}$), el componente se cierra inmediatamente aunque no haya alcanzado el 50% del recorrido.

---

## 🚫 3. Reglas Inquebrantables de Craft (Anti-Patrones Prohibidos)

1. **PROHIBIDO el `ease-in` en entradas:** En el mundo físico, los objetos que entran en tu campo visual ya traen velocidad; nunca arrancan inmóviles acelerando lentamente. Las entradas deben ser enérgicas (`ease-out` con alta pendiente inicial o resorte sub-amortiguado).
2. **PROHIBIDO animar propiedades de layout:** Queda terminantemente vetado animar `width`, `height`, `top`, `left`, `margin` o `padding`. Provocan *Layout Thrashing* y caídas de frames. Toda traslación, escala y transformación DEBE hacerse con:
   ```css
   transform: translate3d(x, y, 0) scale(s);
   opacity: o;
   will-change: transform;
   ```
3. **Animaciones 100% Interrumpibles:** Si el usuario pulsa o arrastra un elemento mientras este está en pleno vuelo, la animación debe detenerse instantáneamente en su posición actual sin saltos bruscos (*zero glitch*).
4. **Respeto a la Accesibilidad:** Todo código debe incorporar:
   ```javascript
   const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (prefersReduced) { /* Transición instantánea de opacidad sin desplazamiento físico */ }
   ```

---

## 📦 4. Catálogo Canónico de Componentes de Autor a Generar

Todo código o demostración interactiva que utilice esta skill debe implementar como mínimo uno de estos patrones:

1. **`VaulDrawer`:** Hoja inferior con barra de arrastre (*grab handle*), escalado del fondo (`scale(0.96) border-radius(16px)` en el contenedor principal mientras el cajón sube) y cierre por inercia o por clic en el fondo difuminado.
2. **`SonnerStack`:** Pila de notificaciones toast vivas que se expanden al pasar el ratón, se contraen en perspectiva z-axis al reposar, y se pueden deslizar lateralmente para descartar con inercia.
3. **`ElasticCard`:** Tarjetas o filas con respuesta física a la pulsación (`scale(0.98)` en `pointerdown`, rebote elástico $\zeta=0.75$ en `pointerup`).
