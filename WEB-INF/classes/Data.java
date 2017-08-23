import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.*;
import java.lang.Math;
import java.util.ArrayList;

import javax.servlet.*;
import javax.servlet.http.*;

public class Data extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
	
        //generate data
        ArrayList<ArrayList<Double>> data = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> element;
        final int N = 20;
        for(int i = 0; i < N; i++){
            element = new ArrayList<Double>();
            element.add(Math.random());
            element.add(Math.random());
            data.add(element);
        }
        
        //convert to JSON
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(data);
        out.println(json);
        out.flush();
        out.close();

        //start learning


        //conver the result of learning to JSON


        //save as a JSON file

    }
}

