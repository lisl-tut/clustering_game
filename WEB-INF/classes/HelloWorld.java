import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class HelloWorld extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        out.print("result.json has been deleted.");

        File file = new File("./result.json");
        file.delete();
    }
}

