import java.io.*;
import java.io.File;
import javax.servlet.*;
import javax.servlet.http.*;

public class Learn extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        
        final String filename = "./result.json";
        File file = new File(filename);
        if(file.exists()){
            try{
                BufferedReader br = new BufferedReader(new FileReader(file));
                String str;
                while((str = br.readLine()) != null){
                    out.println(str);
                }
                br.close();
            }catch(FileNotFoundException e){
            }catch(IOException e){
            }
        }else{
            out.print("ERROR");
        }
        out.flush();
        out.close();

    }
}

