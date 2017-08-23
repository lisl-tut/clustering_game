/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package datagenerator;

import java.util.ArrayList;

/**
 *
 * @author user
 */
public class Sample {
    int cluster;
    
    ArrayList<Double> point = new ArrayList<Double>();
	Sample(double x, double y, int cluster) {
                this.cluster = cluster;
                point.add(x);
                point.add(y);
        }
        
    public double get_point(int index){
        return point.get(index);
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
