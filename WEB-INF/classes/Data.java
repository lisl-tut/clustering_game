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
        out.print("{[");
        for(int i = 0; i < numofdata; i++){
            out.print("[");
            out.print(Math.random());
            out.print(",");
            out.print(Math.random());
            if(i == numofdata - 1){
                out.print("]");
            }else{
                out.print("],");
            }
        }
        out.print("]}");
    }
}

