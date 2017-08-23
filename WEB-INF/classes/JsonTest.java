import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.ArrayList;
import java.lang.Math;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class JsonTest extends HttpServlet{
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws JsonProcessingException, IOException, ServletException{
        ArrayList<ArrayList<Double>> data = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> x;
        
        for(int i = 0; i < 20; i++){
            x = new ArrayList<Double>();
            x.add(Math.random());
            x.add(Math.random());
            data.add(x);
        }

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(data);
        out.println(json);
    }
}
    
