import java.io.*;
import java.lang.Math;
import javax.servlet.*;
import javax.servlet.http.*;

public class Data extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();

        String val = request.getParameter("alg");
        out.print("あなたが選んだアルゴリズムは");
        if(Integer.parseInt(val) == 0){
            out.print("けーみーんずほう");
        }else if(Integer.parseInt(val) == 1){
            out.print("でぃーぴーみーんずほう");
        }
        val = request.getParameter("clu");
        out.print("&clu=" + val);
        val = request.getParameter("thr");
        out.print("&thr=" + val);
        val = request.getParameter("mak");
        out.print("&mak=" + val);
        val = request.getParameter("tun");
        out.print("&tun=" + val);

/*
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
*/
    }
}

