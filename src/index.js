// Cloudflare Worker script with proper D1 table creation

export default {
    async fetch(request, env, ctx) {
      // Handle CORS preflight requests
      if (request.method === "OPTIONS") {
        return handleCors();
      }
      
      // Only allow POST requests to /submit-contact
      if (request.method === "POST" && new URL(request.url).pathname === "/submit-contact") {
        return handleContactSubmission(request, env);
      }
      
      // Add a test endpoint for debugging
      if (request.method === "GET" && new URL(request.url).pathname === "/test-db") {
        return testDatabase(env);
      }
      
      // Return a simple page for GET requests to the root
      if (request.method === "GET" && new URL(request.url).pathname === "/") {
        return new Response("Contact Form API is running", {
          headers: { "Content-Type": "text/plain" }
        });
      }
      
      // Return 404 for any other routes
      return new Response("Not found", { status: 404 });
    },
  };
  
  function handleCors() {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      }
    });
  }
  
  // Add a test endpoint to check if DB connection works
  async function testDatabase(env) {
    try {
      // First try to check if table exists
      const tables = await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='contacts'"
      ).all();
      
      if (tables.results.length === 0) {
        // Table doesn't exist, let's create it using sequential prepare statements
        try {
          // Create table
          await env.DB.prepare(
            "CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, message TEXT NOT NULL, timestamp TEXT NOT NULL, processed BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
          ).run();
          
          // Create indexes (one at a time)
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)"
          ).run();
          
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp)"
          ).run();
          
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_processed ON contacts(processed)"
          ).run();
          
          // Create view
          await env.DB.prepare(
            "CREATE VIEW IF NOT EXISTS unprocessed_contacts AS SELECT * FROM contacts WHERE processed = 0 ORDER BY timestamp ASC"
          ).run();
          
          return new Response(
            JSON.stringify({
              success: true,
              message: "Database table and indexes created successfully"
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              }
            }
          );
        } catch (createError) {
          return new Response(
            JSON.stringify({
              error: "Failed to create database table",
              details: createError.message,
              cause: createError.cause ? createError.cause.message : "Unknown"
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              }
            }
          );
        }
      }
      
      // Table exists, return success message
      return new Response(
        JSON.stringify({
          success: true,
          message: "Database connection successful",
          tables: tables.results
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Database error",
          details: error.message,
          cause: error.cause ? error.cause.message : "Unknown"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    }
  }
  
  async function handleContactSubmission(request, env) {
    // Parse the request body
    let contactData;
    try {
      contactData = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    }
    
    // Validate the data
    const { name, email, phone, message, timestamp } = contactData;
    
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    }
    
    try {
      // Check if table exists first
      const tables = await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='contacts'"
      ).all();
      
      if (tables.results.length === 0) {
        // Table doesn't exist, let's create it using sequential prepare statements
        try {
          // Create table
          await env.DB.prepare(
            "CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, message TEXT NOT NULL, timestamp TEXT NOT NULL, processed BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
          ).run();
          
          // Create indexes (one at a time)
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)"
          ).run();
          
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp)"
          ).run();
          
          await env.DB.prepare(
            "CREATE INDEX IF NOT EXISTS idx_contacts_processed ON contacts(processed)"
          ).run();
        } catch (createError) {
          return new Response(
            JSON.stringify({
              error: "Failed to create database table",
              details: createError.message,
              cause: createError.cause ? createError.cause.message : "Unknown"
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              }
            }
          );
        }
      }
      
      // Insert the data into D1 database
      const result = await env.DB.prepare(
        `INSERT INTO contacts (name, email, phone, message, timestamp) 
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(name, email, phone, message, timestamp || new Date().toISOString())
      .run();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact form submitted successfully",
          id: result.meta.last_row_id
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    } catch (error) {
      // Log the error on the server
      console.error("Database error:", error);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to store your message. Please try again later.",
          details: error.message,
          cause: error.cause ? error.cause.message : "Unknown"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    }
  }