# Solución al error "Command 'npm run build' exited with 1" en Vercel

Este error generalmente significa que hay un problema en tu código que impide que Next.js construya el proyecto correctamente. Muchas veces está relacionado con errores de ESLint o de TypeScript.

## Pasos para identificar y solucionar el error

1. **Reproduce el error localmente**
   Abre una terminal en tu proyecto y ejecuta:
   ```sh
   npm run build
   ```
   Esto mostrará el error exacto que está causando el fallo.

2. **Lee el mensaje de error**
   El mensaje en la terminal te dirá si es un error de ESLint, de sintaxis, de dependencias, etc.

3. **Si es un error de ESLint y quieres ignorarlo temporalmente:**
   Puedes desactivar ESLint en la build de Next.js editando el archivo `next.config.js` (créalo si no existe):

   ```js
   // filepath: c:\Users\Sebastián\Desktop\cotizador-hotel\next.config.js
   // ...existing code...
   module.exports = {
     // ...existing code...
     eslint: {
       ignoreDuringBuilds: true,
     },
   };
   // ...existing code...
   ```

   Luego vuelve a hacer deploy en Vercel.

4. **Si el error es de código (por ejemplo, imports incorrectos, errores de TypeScript, etc):**
   - Corrige el error que te muestra la terminal.
   - Vuelve a ejecutar `npm run build` hasta que no haya errores.

5. **Sube los cambios a GitHub y vuelve a desplegar en Vercel.**

---

**Recomendación:**  
Desactivar ESLint solo es recomendable para pruebas rápidas. Lo ideal es corregir los errores de ESLint para mantener la calidad del código.

---

### Ejemplo de error de ESLint

```
5:8  Error: 'Navbar' is defined but never used.  @typescript-eslint/no-unused-vars
```

**Solución:**  
Elimina la importación de `Navbar` si no la usas, o úsala en tu componente.  
Por ejemplo, si tienes esto al inicio de tu archivo:

```tsx
import Navbar from "@/components/Navbar";
```

Y no usas `<Navbar />` en el JSX, simplemente borra esa línea.

---

¿Quieres ayuda para corregir otro error específico? Copia aquí el mensaje completo que te aparece al ejecutar `npm run build` en tu máquina.