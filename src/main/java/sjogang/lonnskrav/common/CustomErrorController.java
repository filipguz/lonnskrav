package sjogang.lonnskrav.common;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        Object statusCode = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int status = statusCode != null ? Integer.parseInt(statusCode.toString()) : 500;

        if (status == HttpStatus.NOT_FOUND.value()) {
            return """
                    <!DOCTYPE html>
                    <html lang="nb">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>Side ikke funnet — Lønnskrav</title>
                      <style>
                        body { font-family: system-ui, sans-serif; background: #f8fafc; color: #1e293b;
                               display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                        .box { text-align: center; max-width: 420px; padding: 2rem; }
                        h1 { font-size: 4rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; }
                        p { color: #64748b; margin-bottom: 2rem; }
                        a { display: inline-block; background: #0f172a; color: white; font-weight: 600;
                            padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; }
                        a:hover { background: #1e293b; }
                      </style>
                    </head>
                    <body>
                      <div class="box">
                        <h1>404</h1>
                        <p>Siden finnes ikke. Den kan ha blitt flyttet eller slettet.</p>
                        <a href="/">Gå til forsiden</a>
                      </div>
                    </body>
                    </html>
                    """;
        }

        return """
                <!DOCTYPE html>
                <html lang="nb">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Noe gikk galt — Lønnskrav</title>
                  <style>
                    body { font-family: system-ui, sans-serif; background: #f8fafc; color: #1e293b;
                           display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                    .box { text-align: center; max-width: 420px; padding: 2rem; }
                    h1 { font-size: 4rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem; }
                    p { color: #64748b; margin-bottom: 2rem; }
                    a { display: inline-block; background: #0f172a; color: white; font-weight: 600;
                        padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; }
                    a:hover { background: #1e293b; }
                  </style>
                </head>
                <body>
                  <div class="box">
                    <h1>%d</h1>
                    <p>Noe gikk galt. Prøv igjen eller gå tilbake til forsiden.</p>
                    <a href="/">Gå til forsiden</a>
                  </div>
                </body>
                </html>
                """.formatted(status);
    }
}
