/* 
 * KMeans.java ; Cluster.java ; Point.java
 *
 * Solution implemented by DataOnFocus
 * www.dataonfocus.com
 * 2015
 *
*/
//package com.dataonfocus.clustering;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

import static java.awt.SystemColor.info;

public class KMeans {

    //Number of Clusters. This metric should be related to the number of points
    private int NUM_CLUSTERS = 1;
    //Number of Points
    private int NUM_POINTS = 15;
    //Min and Max X and Y
    private static final int MIN_COORDINATE = 0;
    private static final int MAX_COORDINATE = 1;

    private ArrayList<Point> points;
    private ArrayList<Cluster> clusters;

    private ArrayList<Sample> generatedData;

    private String json;

    public KMeans(int k, ArrayList<Sample> data) {
        this.NUM_CLUSTERS = k;
        this.generatedData = data;
        this.points = new ArrayList<Point>();
        this.clusters = new ArrayList();
    }

    public KMeans() {
        this.points = new ArrayList<Point>();
        this.clusters = new ArrayList();
    }

    public static void main(String[] args)  throws JsonProcessingException {

        KMeans kmeans = new KMeans();
        kmeans.init();
        kmeans.calculate();

        Out out = new Out();
    }

    //Initializes the process
    public void init() {
        //Create Points
        double testpointX = 1;
        double testpointY = 2;

        //pointの設定
        //points = Point.createRandomPoints(MIN_COORDINATE,MAX_COORDINATE,NUM_POINTS);

        for(Sample sample : generatedData){
            Point point = new Point(sample.point.get(0), sample.point.get(1));
            points.add(point);
        }

        //Create Clusters
        //Set Random Centroids
        for (int i = 0; i < NUM_CLUSTERS; i++) {


            Cluster cluster = new Cluster(i);
            Point centroid = Point.createRandomPoint2(MIN_COORDINATE,MAX_COORDINATE);
            cluster.setCentroid(centroid);
            clusters.add(cluster);
        }

        //Print Initial state
        plotClusters();
    }

    private void plotClusters() {
        for (int i = 0; i < NUM_CLUSTERS; i++) {
            //Cluster c = clusters.get(i);
            Cluster c = (Cluster) clusters.get(i);
            c.plotCluster();
        }
    }

    public String getJson(){
       return new String(this.json);
    }

    //The process to calculate the K Means, with iterating method.
    public void calculate()   throws JsonProcessingException {
        boolean finish = false;
        int iteration = 0;

        Out out3 = new Out();

        // Add in new data, one at a time, recalculating centroids with each new one. 
        while(!finish) {
            //Clear cluster state
            clearClusters();

            ArrayList<Point> lastCentroids = getCentroids();

            ArrayList<Integer> bra = new ArrayList<>();

            //Assign points to the closer cluster
            assignCluster();

            //Calculate new centroids.
            calculateCentroids();

            iteration++;

            ArrayList<Point> currentCentroids = getCentroids();

            //Calculates total distance between new and old Centroids
            double distance = 0;
            for(int i = 0; i < lastCentroids.size(); i++) {
                distance += Point.distance(lastCentroids.get(i),currentCentroids.get(i));
                //distance += Point.distance(lastCentroids.get(i),currentCentroids.get(i));
            }
            System.out.println("#################");
            System.out.println("Iteration: " + iteration);
            System.out.println("Centroid distances: " + distance);
            plotClusters();

            Out out2 = new Out();
            out2.iter = iteration;
            out2.success = true;

            //out2.centroid[iteration] = new ArrayList<Point>();
            out3.centroid.add(currentCentroids);

            //ArrayList<Integer> clusterallocationarray new ArrayList<Integer>();



            for(Point point : points) {
                bra.add(point.getCluster());
            }
            out3.clusterallocation.add(bra);

            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(out2);

            System.out.println("\n↓json↓");
            System.out.println(json);

            if(distance == 0) {
                finish = true;
            }
        }


        out3.iter = iteration;
        out3.success = true;

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(out3);

        this.json = json;

        System.out.println("\n↓json↓");
        System.out.println(json);

    }

    private void clearClusters() {
        for(Cluster cluster : clusters) {
            cluster.clear();
        }
    }

    private ArrayList<Point> getCentroids() {
        ArrayList<Point> centroids = new ArrayList<Point>(NUM_CLUSTERS);
        for(Cluster cluster : clusters) {
            Point aux = cluster.getCentroid();
            Point point = new Point(aux.getX(),aux.getY());
            centroids.add(point);
        }
        return centroids;
    }

    private void assignCluster() {
        double max = Double.MAX_VALUE;
        double min = max;
        int cluster = 0;
        double distance = 0.0;

        for(Point point : points) {
            min = max;
            for(int i = 0; i < NUM_CLUSTERS; i++) {
                Cluster c = clusters.get(i);
                distance = Point.distance(point, c.getCentroid());
                if(distance < min){
                    min = distance;
                    cluster = i;
                }
            }
            point.setCluster(cluster);
            clusters.get(cluster).addPoint(point);
        }
    }

    private void calculateCentroids() {
        for(Cluster cluster : clusters) {
            double sumX = 0;
            double sumY = 0;
            ArrayList<Point> list = cluster.getPoints();
            int n_points = list.size();

            for(Point point : list) {
                sumX += point.getX();
                sumY += point.getY();
            }

            Point centroid = cluster.getCentroid();
            if(n_points > 0) {
                double newX = sumX / n_points;
                double newY = sumY / n_points;
                centroid.setX(newX);
                centroid.setY(newY);
            }
        }
    }
}
