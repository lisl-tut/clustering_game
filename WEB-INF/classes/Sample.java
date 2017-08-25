import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class Sample {
    public int cluster; 
    public ArrayList<Double> point = new ArrayList<Double>();

    private final static int X = 0;
    private final static int Y = 1;
    
    Sample(double x, double y, int cluster) {
        this.cluster = cluster;
        point.add(x);
        point.add(y);
    }
    
    @JsonIgnore      
    public double getX(){
        return point.get(X);
    }

    @JsonIgnore
    public double getY(){
        return point.get(Y);
    }
    
    public void print(){
        System.out.println("x = " + point.get(0) + ", y = " + point.get(1) + ", cluster=" + this.cluster);
    }
        
    public static void main(String [] args){
        double x = 0.1238888;
        double y = 0.24544;
        int c = 2;
        Sample sample = new Sample(x, y, c);
        sample.print();
    }
   
}
