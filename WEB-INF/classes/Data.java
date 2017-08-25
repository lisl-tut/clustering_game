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
        final String resultFilename = "./result.json";
        File file = new File(resultFilename);
        if(file.exists()) file.delete();
        //remove request file
        final String requestFilename = "./request.json";
        file = new File(requestFilename);
        if(file.exists()) file.delete();
        
        //save a request as file
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(request.getParameterMap());
        try{
            file = new File(requestFilename);
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(json);
            fileWriter.close();
        }catch(IOException e){
            System.err.println("Exception occured");
        }

        //generate data
        int clusterMakeNum = Integer.parseInt(request.getParameter("mak"));
        if(clusterMakeNum == 0)
            clusterMakeNum = (int)(Math.random()*3) + 2;
        int tuning = Integer.parseInt(request.getParameter("tun"));
        DataGenerator dg = new DataGenerator(clusterMakeNum, tuning);
        ArrayList<Sample> samples = dg.generate();        
        //set a streamer
        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        //convert to JSON
        mapper = new ObjectMapper();
        json = mapper.writeValueAsString(samples);
        out.println(json);
        out.flush();
        out.close();

        //start learning
        int k = Integer.parseInt(request.getParameter("clu"));
        double lambda = Integer.parseInt(request.getParameter("thr"));
        Clustering clustering;
        if(Integer.parseInt(request.getParameter("alg")) == 0){
            clustering = new Clustering(samples, 0.0, 1.0, "K", k);
        }else{
            clustering = new Clustering(samples, 0.0, 1.0, "DP", lambda*0.1);
        }
        
        clustering.init();
        clustering.fit();

        //conver the result of learning to JSON
        json = clustering.getJson();

        //save as a JSON file
        try{
            file = new File(resultFilename);
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(json);
            fileWriter.close();
        }catch(IOException e){
            System.err.println("Exception occured");
        }
        
    }
}

