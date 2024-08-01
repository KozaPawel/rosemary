# rosemary

Edge function

```
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  console.log(req.method)
  if (req.method === 'OPTIONS') {
      return new Response(
          'ok',
          {
              headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST",
                  "Access-Control-Expose-Headers": "Content-Length, X-JSON",
                  "Access-Control-Allow-Headers": "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
              }
          }
      );
  }
  else {
      const { url } = await req.json();
      const response = await fetch(url)
      const data = await response.text()
      return new Response(
          JSON.stringify(data),
          {
              headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST",
                  "Access-Control-Expose-Headers": "Content-Length, X-JSON",
                  "Access-Control-Allow-Headers": "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
              }
          }
      );
  }
})

```
