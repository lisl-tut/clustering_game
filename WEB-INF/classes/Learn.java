import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class Learn extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        out.print("learn");

    }
}

