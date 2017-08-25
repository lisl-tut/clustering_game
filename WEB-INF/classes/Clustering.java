import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.lang.reflect.Array;

import java.util.ArrayList;

public class Clustering {
    
    //Attributes for test
    private final static int NUM_POINTS = 15;
    
    //Min and Max X and Y
    private double minCoordinate = 0;
    private double maxCordinate = 1;

    private int k = 1;
    private double lambda = 0.2;
    
    private ArrayList<Point> points;
    private ArrayList<Cluster> clusters;

    private ArrayList<Sample> generatedData = null;

    private String json;
    
    private String method = "K";

    public Clustering() {
        this.points = new ArrayList<Point>();
        this.clusters = new ArrayList();
    }
    
    public Clustering(ArrayList<Sample> data, double min, double max) {
        this();
        this.generatedData = data;
        this.minCoordinate = min;
        this.maxCordinate = max;
    }
    
    public Clustering(ArrayList<Sample> data, double min, double max, String method, int k) {
        this(data, min, max);
        assert method.equals("K") || method.equals("k");
        this.method = "K";
        this.k = k;
    }
    
    public Clustering(ArrayList<Sample> data, double min, double max, String method, double lambda) {
        this(data, min, max);
        assert method.equals("DP") || method.equals("dp");
        this.method = "DP";
        this.lambda = lambda;
    }

    public static void main(String[] args)  throws JsonProcessingException {

        DataGenerator dg = new DataGenerator(3);
        
        Clustering kmeans = new Clustering(dg.generate(), 0.0, 1.0, "K", 3);
        //KMeans kmeans = new KMeans();
        kmeans.init();
        kmeans.fit();

    }

    //Initializes the process
    public void init() {

        //generate points
        if(generatedData == null){
            points = Point.createRandomPoints(0.0, 1.0, NUM_POINTS);
        }else{
            for(Sample sample : generatedData){
                Point point = new Point(sample.getX(), sample.getY());
                points.add(point);
            }
        }

        //Create Clusters + Set Random Centroids
        for (int i = 0; i < k; i++){
            Cluster cluster = new Cluster(i);
            cluster.setCentroid(new Point(-1, -1));
            clusters.add(cluster);
        }
        
        for (Point point : points){
            clusters.get((int)(Math.random()*clusters.size())).addPoint(point);
        }
        
        calculateCentroids();
    }

    //The process to calculate the K Means, with iterating method.
    public void fit()   throws JsonProcessingException {
        
        boolean finish = false;
        int iteration = 0;
        double e = Double.MAX_VALUE;

        ArrayList<Point> lastCentroids;
        ArrayList<Point> currentCentroids;
        ArrayList<Integer> clusterLabels;
        Out out = new Out();

        while(e != 0) {
            clearClusters();
            
            lastCentroids = getCentroids();
            
            assignCluster(iteration);
            calculateCentroids();

            currentCentroids = getCentroids();
            
            clusterLabels = new ArrayList<>();
            for(Point point : points) clusterLabels.add(point.getClusterLabel());
            out.setToIter(getLabels(), currentCentroids, clusterLabels);
            
            e = 0.0;
            if(currentCentroids.size() == lastCentroids.size()){
                for(int i = 0; i < lastCentroids.size(); i++)
                    e += Point.distance(lastCentroids.get(i),currentCentroids.get(i));
            }else{
                e = Double.MAX_VALUE;
            }
            iteration++;
        }

        out.iters = iteration;
        out.success = true;

        ObjectMapper mapper = new ObjectMapper();
        this.json = mapper.writeValueAsString(out);

        System.out.println(json);
    }

    private void assignCluster(int iter) {       
        double min;
        Cluster minCluster = null;
        double distance;

        for(Point point : points) {
            min = Double.MAX_VALUE;
            for(Cluster c : clusters) {
                distance = Point.distance(point, c.getCentroid());
                if(distance < min){
                    min = distance;
                    minCluster = c;
                }
            }
            assert minCluster != null : "minCluster is null";
            if(this.method.equals("DP") && min > lambda){
                k++;
                Cluster cluster = new Cluster(k);
                point.setCluster(k);
                cluster.centroid = point;
                cluster.points.add(point);
                clusters.add(cluster);
                minCluster.removePoint(point);
                Cluster removeCluster = null;
                if(iter != 1){
                    for(Cluster retCluster : clusters){
                        if(cluster.points.isEmpty()){
                            removeCluster = retCluster;
                        }
                    }
                    clusters.remove(removeCluster);
                }
            }else{
                point.setCluster(minCluster.getId());
                minCluster.addPoint(point);
            }

        }
        
    }

    private void calculateCentroids() {
        for(Cluster cluster : clusters) {
            double newX = 0;
            double newY = 0;
            
            ArrayList<Point> clusterPoints = cluster.getPoints();
            int pointNum = clusterPoints.size();

            for(Point point : clusterPoints) {
                newX += point.getX() / pointNum;
                newY += point.getY() / pointNum;
            }

            Point centroid = cluster.getCentroid();
            if(pointNum > 0) centroid.set(newX, newY);
        }
    }
    
        private ArrayList<Point> getCentroids() {
        ArrayList<Point> centroids = new ArrayList<Point>(k);
        for(Cluster cluster : clusters) {
            Point aux = cluster.getCentroid();
            Point point = new Point(aux.getX(),aux.getY());
            centroids.add(point);
        }
        return centroids;
    }
    
    private ArrayList<Integer> getLabels(){
        ArrayList<Integer> labels = new ArrayList<Integer>();
        for(Cluster cluster : clusters){
            labels.add(cluster.getId());
        }
        return labels;
    }
    
    private void plotClusters() {
        for (Cluster c : clusters) System.out.println(c);
    }

    public String getJson(){
       return this.json;
    }

    private void clearClusters() {
        for(Cluster cluster : clusters) cluster.clear();
    }
}
