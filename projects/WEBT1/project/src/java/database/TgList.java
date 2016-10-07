package database;

import java.io.Serializable;
import java.util.*;
import java.sql.*;

public class TgList extends HashMap implements Serializable {

    public static class TgListEllement implements Comparable, Serializable {

        int tgid;
        String Name;
        String Comment;
        String EU;
        double minEU;
        double maxEU;
        int type;

        public TgListEllement(int itgid,
                String iName,
                String iComment,
                String iEU,
                double iminEU,
                double imaxEU,
                int type) {
            tgid = itgid;
            Name = iName.trim().toUpperCase();
            Comment = iComment;
            EU = iEU;
            minEU = iminEU;
            maxEU = imaxEU;
            this.type = type;

        }

        public int compareTo(Object o1) {
            return toString().compareTo(o1.toString());
        }

        public String toString() {
            return Name;
        }
        private double[] norm;

        public double[] getNorm() {
            return this.norm;
        }

        public void setNorm(double[] norm) {
            this.norm = norm;
        }

        public String getName() {
            return Name;
        }

        public String getId() {
            return String.valueOf(tgid);
        }

        public String getComment() {
            return Comment;
        }

        public String getUE() {
            return EU;
        }

        public double minUE() {
            return minEU;
        }

        public double maxUE() {
            return maxEU;
        }

        public int getType() {
            return type;
        }
    }

    
    private HashMap IntMap = new HashMap();
    private List ObjList = new ArrayList();

    public TgList() {
    }

    public List getList() {
        return ObjList;
    }

    public boolean add(TgListEllement val) {
        if (val == null) {
            return false;
        }
        if (!(val instanceof TgListEllement)) {
            return false;
        }
        if (get(val.Name.toUpperCase()) != null) {
            return false;
        }
        if (IntMap.get(String.valueOf(val.tgid)) != null) {
            return false;
        }
        ObjList.add(val);
        Collections.sort(ObjList);
        put(val.Name.toUpperCase(), val);
        IntMap.put(String.valueOf(val.tgid), val);
        return true;
    }

    public TgListEllement find(String val) {
        return ((TgListEllement) get(val));
    }

    public TgListEllement find(int tgid) {
        return ((TgListEllement) IntMap.get(String.valueOf(tgid)));
    }

    public int FindId(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return -1;
        }
        return temp_.tgid;
    }

    public double[] FindNorm_(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return null;
        }
        return temp_.getNorm();
    }

    public double FindNorm(String val, int id_) {
        double[] vl = FindNorm_(val);
        if (vl == null) {
            return 0;
        }
        if (id_ >= vl.length) {
            return 0;
        }
        return vl[id_];
    }

    public void AddNorm(String val, double[] s) {
        val = val.toUpperCase();
        TgListEllement temp_ = find(val);
        if (temp_ == null) {
            return;
        }
        temp_.setNorm(s);
    }

    public boolean isNorm(String val) {
        double[] vl = FindNorm_(val);
        return (vl != null);
    }

    public int FindNum(String val) {
        int id = (Collections.binarySearch(ObjList, val.trim().toUpperCase()));
        if (id < 0) {
            return -1;
        } else {
            return id;
        }
    }

    public String FindComment(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return "";
        }
        return temp_.Comment;
    }

    public String FindUE(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return "";
        }
        return temp_.EU;
    }

    public double FindMin(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return 0;
        }
        return temp_.minEU;
    }

    public double FindMax(String val) {
        String val_ = val.toUpperCase();
        TgListEllement temp_ = find(val_);
        if (temp_ == null) {
            return 0;
        }
        return temp_.maxEU;

    }

    public String getComment(int val) {
        if (val >= size()) {
            return "";
        }
        return ((TgListEllement) ObjList.get(val)).Comment;
    }

    public String getId(int val) {
        if (val >= size()) {
            return "";
        }
        return String.valueOf(((TgListEllement) ObjList.get(val)).tgid);
    }

    public String getEU(int val) {
        if (val >= size()) {
            return "";
        }
        return ((TgListEllement) ObjList.get(val)).EU;
    }

    public String getName(int val) {
        if (val >= size()) {
            return "";
        }
        return ((TgListEllement) ObjList.get(val)).Name;
    }

    public void assign(TgList val) {
        TgListEllement temp_;
        if (val == null) {
            return;
        }
        val.clear();
        val.IntMap.clear();
        val.ObjList.clear();
        Iterator temp_iter = this.values().iterator();
        while (temp_iter.hasNext()) {
            temp_ = ((TgListEllement) temp_iter.next());
            add(temp_);
        }

    }

    public synchronized void Load()  {

        Connection conn = null;
        java.sql.Statement stmt = null;
        ResultSet rset = null;
        /*try {
            try {
                conn = ImmiDB.ImmConnect.getLocalConn("trend");
                stmt = conn.createStatement();
                rset = stmt.executeQuery("SELECT cod, iName, iComment, EU, logTime, mineu, maxeu  FROM trenddef");
                while (rset.next()) {

                    TgListEllement temp = new TgListEllement(rset.getInt("cod"), rset.getString("iName"),
                            rset.getString("iComment"), rset.getString("EU"), rset.getDouble("mineu"), rset.getDouble("maxeu"), (int) rset.getFloat("logTime"));
                    add(temp);
                }
            } finally {
                ImmiDB.ImmConnect.closeConn(conn, stmt, rset);
            }
        } catch (SQLException e) {
            throw new ImmiError.NoTrenddefTable(e);
        }

        for (int i = 0; i < NL.size(); i++) {
            ImmiDB.NormTable.UnitTable tempn = (ImmiDB.NormTable.UnitTable) NL.get(i);
            String _tg = tempn.getName();
            AddNorm(_tg, NL.getNorm(_tg));
        }*/

    }
}
