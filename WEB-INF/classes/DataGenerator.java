import java.util.ArrayList;
import java.util.Random;

public class DataGenerator {
    
    private int clusterNum = 3;
    private final ArrayList<Sample> samples;
    
    private final double sd = 0.1; // standard variation
    private final double criticalRegion = 2.0; 
    
    private int N = 20; // num of samples
   
    private int tuning = 2;
 
    public DataGenerator(int clusterNum) {
        this.clusterNum = clusterNum;
        this.samples = new ArrayList<Sample>();
    }

    public DataGenerator(int clusterNum, int tuning) {
        this(clusterNum);    
        this.tuning = tuning;
    }

    public ArrayList<Sample> generate(){
        
        ArrayList<Sample> clusterCenters;
        do{
            clusterCenters = new ArrayList<Sample>();
            for(int k = 0; k < clusterNum; k++){
                double x = (1-2*criticalRegion*sd)*Math.random() + sd*criticalRegion;
                double y = (1-2*criticalRegion*sd)*Math.random() + sd*criticalRegion;
                Sample cluster_center = new Sample(x, y, k);
                clusterCenters.add(cluster_center);
            }
            double meanX = 0; double meanY = 0;
            for(Sample s : clusterCenters){
                meanX += s.getX() / clusterCenters.size();
                meanY += s.getY() / clusterCenters.size();
            }
            double var = 0;
            for(Sample s : clusterCenters){
                var += Math.pow(s.getX() - meanX, 2) + Math.pow(s.getY() - meanY, 2);
            }
            var /= clusterNum;
            
            if(this.tuning == 2){
                break;
            }else if(this.tuning == 0){
                if(var > 1.0/8.0 ) break;
            }else{
                if(var < 1.0/8.0 ) break;
            }
        }while(true);
        
        Random rnd = new Random();
        for(int i = 0; i < N; i++){
            int ran = rnd.nextInt(clusterNum);
            double x = clusterCenters.get(ran).getX() + rnorm(sd);
            double y = clusterCenters.get(ran).getY() + rnorm(sd);
            Sample sample = new Sample(x, y, ran);
            samples.add(sample);
        }
        
        return samples;
    }

    public void print(){
        System.out.println("samples");
        for(Sample sample : samples){
            sample.print();
        }
    }

    public double rnorm(double sigma){
        return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()) * sigma;
    }
        
    public static void main(String[] args) {
        DataGenerator dg = new DataGenerator(3);
        dg.generate();
        dg.print();
        /* instance_sample.print();
        x = 0.1238888, y = 0.24544, cluster=2
        */
    }
    
}
