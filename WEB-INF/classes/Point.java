import java.util.ArrayList;
import java.util.Random;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Point {

    private double x = 0;
    private double y = 0;
    private int clusterNumber = 0;

    public Point(double x, double y)
    {
        this.x = x;
        this.y = y;
    }

    public void set(double x, double y){
        this.x = x;
        this.y = y;
    }

    public double getX()  {
        return this.x;
    }

    public double getY() {
        return this.y;
    }

    public void setCluster(int n) {
        this.clusterNumber = n;
    }
 
    @JsonIgnore
    public int getClusterLabel() {
        return this.clusterNumber;
    }

    //Calculates the distance between two points.
    protected static double distance(Point p, Point centroid) {
        return Math.sqrt(Math.pow((centroid.getY() - p.getY()), 2) + Math.pow((centroid.getX() - p.getX()), 2));
    }

    protected static Point createPoint(double x, double y) {
        return new Point(x,y);
    }
    
    protected static Point createRandomPoint(double min, double max) {
        Random r = new Random();
        double x = min + (max - min) * r.nextDouble();
        double y = min + (max - min) * r.nextDouble();
        return createPoint(x,y);
    }

    protected static ArrayList createRandomPoints(double min, double max, int number) {
        ArrayList<Point> points = new ArrayList(number);

        for(int i = 0; i < number; i++) {
            points.add(createRandomPoint(min,max));
        }
        return points;
    }

    @Override
    public String toString() {
        return "("+x+","+y+")";
    }
}
