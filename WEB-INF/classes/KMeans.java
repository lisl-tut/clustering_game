import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

public class KMeans {
    
    //Attributes for test
    private final static int NUM_POINTS = 15;
    
    //Min and Max X and Y
    private double minCoordinate = 0;
    private double maxCordinate = 1;

    private int numClusters = 3;
    
    private ArrayList<Point> points;
    private ArrayList<Cluster> clusters;

    private ArrayList<Sample> generatedData = null;

    private String json;

    public KMeans() {
        this.points = new ArrayList<Point>();
        this.clusters = new ArrayList();
    }
    
    public KMeans(int k, ArrayList<Sample> data, double min, double max) {
        this();
        this.numClusters = k;
        this.generatedData = data;
        this.minCoordinate = min;
        this.maxCordinate = max;
    }

    public static void main(String[] args)  throws JsonProcessingException {

        DataGenerator dg = new DataGenerator(3);
        
        KMeans kmeans = new KMeans(3, dg.generate(), 0.0, 1.0);
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
        for (int i = 0; i < numClusters; i++) {
            Cluster cluster = new Cluster(i);
            Point centroid;
            if(generatedData == null){
                centroid = Point.createRandomPoint(0.0, 1.0);
            }else{
                centroid = Point.createRandomPoint(this.minCoordinate, this.maxCordinate);
            }
            cluster.setCentroid(centroid);
            clusters.add(cluster);
        }
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

            assignCluster();
            calculateCentroids();

            currentCentroids = getCentroids();
            
            clusterLabels = new ArrayList<>();
            for(Point point : points) clusterLabels.add(point.getClusterLabel());
            out.setToIter(clusters.size(), currentCentroids, clusterLabels);
            
            e = 0.0;
            for(int i = 0; i < lastCentroids.size(); i++)
                e += Point.distance(lastCentroids.get(i),currentCentroids.get(i));
            iteration++;
        }

        out.iters = iteration;
        out.success = true;

        ObjectMapper mapper = new ObjectMapper();
        this.json = mapper.writeValueAsString(out);

        System.out.println(json);
    }

    private ArrayList<Point> getCentroids() {
        ArrayList<Point> centroids = new ArrayList<Point>(numClusters);
        for(Cluster cluster : clusters) {
            Point aux = cluster.getCentroid();
            Point point = new Point(aux.getX(),aux.getY());
            centroids.add(point);
        }
        return centroids;
    }

    private void assignCluster() {       
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
            point.setCluster(minCluster.getId());
            clusters.get(minCluster.getId()).addPoint(point);
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
