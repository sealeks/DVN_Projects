/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package main;

import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpHost;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.Header;

import org.apache.http.HttpEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;

/*
 *
 * @author sealeks@mail.ru
 */
public class HttpProxyServlet extends HttpServlet {

    private String host;
    private int port;
    private String schema;
    private String subpath;

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);

        if (getServletConfig().getInitParameter("host") != null) {
            host = getServletConfig().getInitParameter("host");
        } else {
            host = "";
        }

        if (getServletConfig().getInitParameter("port") != null) {
            try {
                port = Integer.valueOf(getServletConfig().getInitParameter("port"));
            } catch (NumberFormatException e) {
                port = 80;
            }
        } else {
            port = 80;
        }

        if (getServletConfig().getInitParameter("schema") != null) {
            schema = getServletConfig().getInitParameter("schema");
        } else {
            schema = "http";
        }

        if (getServletConfig().getInitParameter("subpath") != null) {
            subpath = getServletConfig().getInitParameter("subpath");
        } else {
            subpath = "";
        }

    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpRequestBase req = null;

        try {

            CloseableHttpClient httpclient = HttpClients.createDefault();

            HttpHost target = new HttpHost(host, port, schema);

            String meth = request.getMethod();

            if (meth == "GET") {
                req = new HttpGet(subpath);
            } else {
                req = new HttpPost(subpath);
            }

            /*Enumeration<String> reqheaders = request.getHeaderNames();
             while (reqheaders.hasMoreElements()) {
             String name = reqheaders.nextElement();
             if (name != "content-length") {
             req.addHeader(name, request.getHeader(name));
             }
             //System.out.println("request header : " + name + " = " + request.getHeader(name));
             }*/
            InputStream instream = request.getInputStream();

            InputStreamEntity reqentity = new InputStreamEntity(instream, request.getContentLength());

            if (req instanceof HttpEntityEnclosingRequestBase) {
                ((HttpEntityEnclosingRequestBase) req).setEntity(reqentity);
            }

            //System.out.println("Executing request " + req.getRequestLine() + " to " + target + " via " /*+ proxy*/);
            CloseableHttpResponse resp = httpclient.execute(target, req);

            Header[] hdrs = resp.getAllHeaders();

            for (int i = 0; i < hdrs.length; ++i) {
                Header elem = hdrs[i];
                //System.out.println("response header : " + elem.getName() + " = " + elem.getValue());
                response.addHeader(elem.getName(), elem.getValue());
            }

            HttpEntity respentity = resp.getEntity();

            if (respentity != null) {
                respentity.writeTo(response.getOutputStream());
            }
        } catch (org.apache.http.client.ClientProtocolException pe) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        } catch (java.lang.Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {

        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Hand les the HTTP <code>GET</code> method.
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
        return "Proxy Servlet";
    }// </editor-fold>

}
