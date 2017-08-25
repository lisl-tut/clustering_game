import java.util.ArrayList;

public class Cluster {

    public ArrayList<Point> points; //including history
    public Point centroid;
    public int id;

    //Creates a new Cluster
    public Cluster(int id) {
        this.id = id;
        this.points = new ArrayList();
        this.centroid = null;
    }

    public ArrayList<Point> getPoints() {
        return points;
    }

    public void addPoint(Point point) {
        points.add(point);
    }
    
    public void removePoint(Point point){
        points.remove(point);
    }

    public void setPoints(ArrayList<Point> points) {
        this.points = points;
    }

    public Point getCentroid() {
        return centroid;
    }

    public void setCentroid(Point centroid) {
        this.centroid = centroid;
    }

    public int getId() {
        return id;
    }

    public void clear() {
        points.clear();
    }

    @Override
    public String toString() {
        String str = "";
        str += "[Cluster: " + id +"]\n";
        str += "[Centroid: " + centroid + "]\n";
        str += "[Points: \n";
        for(Point p : points) str += p + "\n";
        str += "]\n";
        return str;
    }
}
