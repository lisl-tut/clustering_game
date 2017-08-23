import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.*;
import java.lang.Math;
import java.util.ArrayList;
import java.io.File;

import javax.servlet.*;
import javax.servlet.http.*;

public class Data extends HttpServlet{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException{

        //remove result file
        final String filename = "./result.json";
        File file = new File(filename);
        if(file.exists()) file.delete();

        //set a streamer
        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
	
        //generate data
        ArrayList<ArrayList<Double>> data = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> element;
        final int N = 20;
        for(int i = 0; i < N; i++){
            element = new ArrayList<Double>();
            element.add(Math.random()/0.5);
            element.add(Math.random()/0.5);
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
        try{
            file = new File(filename);
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(json);
            fileWriter.close();
        }catch(IOException e){
            System.err.println("Exception occured");
        }
        
    }
}

