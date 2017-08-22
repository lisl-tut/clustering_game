import java.io.*;
import java.lang.Math;
import javax.servlet.*;
import javax.servlet.http.*;

public class Data extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        String val = request.getParameter("numofdata");
        int numofdata = Integer.parseInt(val);
        response.setContentType("text/plain");       
 
        PrintWriter out = response.getWriter();
        for(int i = 0; i < numofdata; i++){
            out.println(Math.random()+"\n\r");
        }
    }
}

