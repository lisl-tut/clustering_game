/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.util.ArrayList;
import java.util.Random;

public class DataGenerator {
    int cluster_num = 3;
    
    ArrayList<Sample> samples = new ArrayList<Sample>();
	DataGenerator(int cluster_num) {
                this.cluster_num = cluster_num;
        }
        
        public ArrayList<Sample> generate(){
            System.out.println("generate");
            ArrayList<Sample> cluster_centers = new ArrayList<Sample>();
            System.out.println("cluster_center");
            for(int k = 0; k < cluster_num; k++){
                double x = Math.random();
                double y = Math.random();
                Sample cluster_center = new Sample(x, y, k);
                cluster_centers.add(cluster_center);
                cluster_center.print();
            }

            int sample_num = 20;
            Random rnd = new Random();
            double sigma = 0.01;
            for(int i = 0; i < sample_num; i++){
                int ran = rnd.nextInt(cluster_num);
                double x = cluster_centers.get(ran).get_point(0) + rnorm(sigma);
                double y = cluster_centers.get(ran).get_point(1) + rnorm(sigma);
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
        /*
        x = 0.1238888, y = 0.24544, cluster=2
        */
    }
    
}
