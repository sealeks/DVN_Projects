/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

import java.sql.*;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.json.simple.*;

import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.TagList;
import javax.servlet.ServletConfig;

/**
 *
 * @author sealeks@mail.ru
 */
public class DBServlet extends HttpServlet {

    static String TAG_REQUEST = "select *  from trenddef";

    public static final int REQ_NULL = 0;
    public static final int REQ_ERROR = 1;
    public static final int REQ_INIT = 2;
    public static final int REQ_TRENDS = 3;
    public static final int REQ_JOURNAL = 4;

    private static int ERROR_BADREQ = 1;
    private static int ERROR_IOREQ = 2;
    private static int ERROR_PARSEREQ = 3;
    private static int ERROR_REQ = 4;
    private static int ERROR_DBREQ = 5;

    private TagList tagList;

    private Connection getConnection() {
        try {
            InitialContext cxt = new InitialContext();
            if (cxt != null) {

                DataSource ds = (DataSource) cxt.lookup("java:/comp/env/trend");

                if (ds != null) {
                    return ds.getConnection();
                }

            }
        } catch (NamingException e) {
            System.out.println(e.getMessage());
        } catch (SQLException se) {
            System.out.println(se.getMessage());
        } catch (Exception re) {
            System.out.println(re.getMessage());
        }
        return null;
    }

    private TagList getTags() {
        if (tagList != null) {
            return tagList;
        }
        Object testattr = getServletContext().getAttribute("tagList");
        if (testattr != null) {
            tagList = (TagList) testattr;
            return tagList;
        }
        Connection connection = getConnection();
        Statement statement = null;
        ResultSet rset = null;

        if (connection != null) {
            try {
                statement = connection.createStatement();
                rset = statement.executeQuery(TAG_REQUEST);
                TagList tmpList = new TagList();
                while (rset.next()) {
                    TagList.Tag temp = new TagList.Tag(rset.getInt("cod"),
                            rset.getString("iname"),
                            rset.getString("icomment"),
                            rset.getString("eu"),
                            rset.getDouble("mineu"),
                            rset.getDouble("maxeu"),
                            (int) rset.getFloat("type"));

                    tmpList.add(temp);
                }
                tagList = tmpList;
                getServletContext().setAttribute("tagList", tagList);
                return tagList;
            } catch (SQLException se) {
                System.out.println(se.getMessage());
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        return null;
    }

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        TagList tst = getTags();
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int reqtype = REQ_NULL;
        int errornum = 0;
        String errormessage = "";

        try {

            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();

            JSONParser parser = new JSONParser();
            ArrayList requesttags = new ArrayList();
            Date start = null;
            Date stop = null;

            try {

                Object tstreq = parser.parse(request.getReader());
                JSONObject jobj = (JSONObject) tstreq;

                if (jobj != null) {

                    Object initobj = jobj.get("init");
                    Object tagarr = jobj.get("tags");
                    Object journalobj = jobj.get("journal");
                    Object strtobj = jobj.get("start");
                    Object stpobj = jobj.get("stop");

                    if (initobj != null) {
                        reqtype = REQ_INIT;
                    } else if (tagarr != null && strtobj != null && stpobj != null) {
                        reqtype = REQ_TRENDS;
                        JSONArray jarray = (JSONArray) tagarr;
                        long jstart = java.lang.Long.parseLong(strtobj.toString());
                        long jstop = java.lang.Long.parseLong(stpobj.toString());
                        start = new Date(jstart);
                        stop = new Date(jstop);
                        if (jarray != null && start != null && stop != null) {
                            for (int i = 0; i < jarray.size(); ++i) {
                                requesttags.add((String) jarray.get(i));
                            }
                        } else {
                            reqtype = REQ_ERROR;
                            errornum = ERROR_BADREQ;
                        }
                    } else if (journalobj != null && strtobj != null && stpobj != null) {
                        reqtype = REQ_JOURNAL;
                        long jstart = java.lang.Long.parseLong(strtobj.toString());
                        long jstop = java.lang.Long.parseLong(stpobj.toString());
                        start = new Date(jstart);
                        stop = new Date(jstop);
                        if (!(start != null && stop != null)) {
                            reqtype = REQ_ERROR;
                            errornum = ERROR_BADREQ;
                        }
                    } else {
                        reqtype = REQ_ERROR;
                        errornum = ERROR_BADREQ;
                    }
                } else {
                    reqtype = REQ_ERROR;
                    errornum = ERROR_BADREQ;
                }
            } catch (IOException ei) {
                reqtype = REQ_ERROR;
                errornum = ERROR_IOREQ;
                System.out.println(ei.getMessage());
            } catch (ParseException ep) {
                reqtype = REQ_ERROR;
                errornum = ERROR_PARSEREQ;
                System.out.println(ep.getMessage());
            } catch (Exception e) {
                reqtype = REQ_ERROR;
                errornum = ERROR_REQ;
                System.out.println(e.getMessage());
            }

            switch (reqtype) {
                case REQ_INIT:
                    proccessTagsRequest(out);
                    break;
                case REQ_TRENDS:
                    proccessTrendsRequest(out, requesttags, start, stop);
                    break;
                default: {
                    proccessTagsRequest(out);
                    //proccessErrorRequest(out, errornum, errormessage);
                }
            }

            out.close();
        } catch (IOException ei) {
            System.out.println(ei.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private void proccessErrorResonse(PrintWriter out, int error, String mess) {

    }

    private void proccessTagsRequest(PrintWriter out) {

        TagList tagLst = getTags();
        JSONObject result = new JSONObject();
        if (tagLst != null) {
            JSONArray tags = new JSONArray();
            List tglist = tagLst.getList();
            for (Object item : tglist) {
                TagList.Tag tg
                        = (TagList.Tag) item;
                JSONObject jsntag = new JSONObject();
                jsntag.put("cod", tg.getId());
                jsntag.put("comment", tg.getComment());
                jsntag.put("eu", tg.getUE());
                jsntag.put("mineu", tg.minUE());
                jsntag.put("maxeu", tg.maxUE());
                jsntag.put("name", tg.getName());
                jsntag.put("type", tg.getType());
                tags.add(jsntag);
            }
            result.put("tags", tags);
        } else {
            result.put("error", "Not context");
        }
        out.print(result.toString());
    }

    private void proccessTrendsRequest(PrintWriter out, ArrayList lst, Date start, Date stop) {

        Connection conn = null;

        ServletContext sc = getServletContext();
        TagList tagList = (TagList) sc.getAttribute("sessionTL");

        try {
            if (tagList != null) {
                JSONArray result = new JSONArray();
                for (int i = 0; i < lst.size(); ++i) {
                    TagList.Tag tg = tagList.find((String) lst.get(i));
                    if (tg != null) {
                        proccessTrendRequest(conn, result, tg, start, stop);
                    } else {
                    }
                }
                out.print(result.toString());
                return;
            }
        } catch (java.lang.Exception e) {
        } finally {
            try {
                if ((conn != null) && (!conn.isClosed())) {
                    conn.close();
                }
            } catch (java.sql.SQLException exp) {
            }
        }

        JSONObject result = new JSONObject();
        result.put("error", "Not context");

    }

    private void proccessTrendRequest(Connection conn, JSONArray result, TagList.Tag tg, Date start, Date stop) {

        Statement stmt = null;
        ResultSet rset = null;

        JSONObject jsntag = new JSONObject();
        jsntag.put("cod", tg.getId());

        try {

            if (conn == null) {
                //conn = ImmiDB.ImmConnect.getLocalConn("trend");
            }

            JSONArray data = new JSONArray();

            long lstart = start.getTime();
            long lstop = stop.getTime();
            long inc = 1000 * 3600 * 24;

            stmt = conn.createStatement();

            while (lstop >= lstart) {

                /*  String tn = Immi.DateUtil.getNameTable(lstart, "tr");


                 boolean double_req = (tn != Immi.DateUtil.getNameTable(lstart + inc, "tr"));

                 for (int i = 0; i < 2; i++) {

                 String query = "SELECT tm, val FROM " + tn + " WHERE ((cod=" + tg.getId() +
                 ") and ((tm>='" + Immi.DateUtil.TimeToDT(lstart) + "') and (tm<='" +
                 Immi.DateUtil.TimeToDT(lstop) + "'))) ORDER BY tm ASC ";
                 try {
                 rset = stmt.executeQuery(query);
                 while (rset.next()) {
                 JSONArray point = new JSONArray();
                 Timestamp ts = rset.getTimestamp("tm");
                 point.add(ts.getTime());
                 if (rset.getObject("val") != null) {
                 point.add(rset.getObject("val"));
                 } else {
                 point.add("");
                 }
                 data.add(point);
                 }
                 } catch (java.sql.SQLException exp) {
                 } finally {
                 }
                 if (double_req) {
                 tn = Immi.DateUtil.getNameTable(lstart + inc, "tr");
                 } else {
                 break;
                 }
                 }*/
                lstart += inc;

            }

            jsntag.put("comment", tg.getComment());
            jsntag.put("eu", tg.getUE());
            jsntag.put("mineu", tg.minUE());
            jsntag.put("maxeu", tg.maxUE());
            jsntag.put("name", tg.getName());
            jsntag.put("data", data);

        } catch (java.sql.SQLException exp) {
            jsntag.put("error", exp.toString());
        } finally {
            //ImmiDB.ImmConnect.closeConn(conn, stmt, rset);
        }
        result.add(jsntag);
    }

    private void proccessErrorRequest(PrintWriter out, Object error) {
        JSONObject result = new JSONObject();
        result.put("error", error);
        out.print(result.toString());
    }
}
