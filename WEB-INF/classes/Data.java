import java.io.*;
import java.lang.Math;
import javax.servlet.*;
import javax.servlet.http.*;

public class Data extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        for(int i = 0; i < 30; i++){
            out.println(Math.random()+"\n");
        }
    }
}

