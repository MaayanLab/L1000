import React, { Component } from 'react';
import cn from 'classnames';
import styles from './AboutView.scss';
// import { Link } from 'react-router';

export class AboutView extends Component {
  render() {
    return (
      <div className={cn(['container', styles.about])}>
        <h1 className="text-center">About L1000</h1>
        <h5>
          <em>
            The information below was taken from <a href="http://www.lincscloud.org/l1000/">
            http://www.lincscloud.org/l1000/</a>
          </em>
        </h5>
        <a href="http://amp.pharm.mssm.edu/static/L1000/L1000_data_flow.png">
          <img
            className="img-responsive"
            src="http://amp.pharm.mssm.edu/static/L1000/L1000_data_flow.png"
          />
        </a>
        <h3>The L1000 Concept</h3>
        <p>
          Gene expression is highly correlated. We take advantage of this high degree of
          correlation to reduce the number of measurements needed to generate meaningful
          gene expression data for the approximately 20,000 genes in the human genome.
        </p>
        <p>
          By analyzing several query-result pairs from well-known published and unpublished
          CMap/LINCS connections, we determined that a carefully chosen set of 1,000 genes
          can capture approximately 80% of the information. We call these genes the landmark
          genes. They were selected by analyzing gene expression profiles of cells collected
          from normal tissues and various disease types. These genes are:
        </p>
        <ol>
          <li>minimally redundant</li>
          <li>widely expressed in different cellular contexts</li>
          <li>possess inferential value in our statistical models</li>
        </ol>
        <p>
          L1000 is a gene expression profiling assay based on the direct measurement of this
          reduced representation of the transcriptome and computational inference of the
          portion of the transcriptome not explicitly measured.
        </p>
        <p>
          Download the <a href="http://amp.pharm.mssm.edu/static/L1000/Landmark_Genes_n978.xlsx">
          full list of landmark genes</a>.
        </p>
        <h3>Assay Description</h3>
        <p>
          L1000 is a bead-based, high-throughput gene expression assay in which cultured cells
          are treated with various chemical and genetic perturbations and the corresponding
          transcriptional responses are measured. The data are processed through a
          computational pipeline, outlined above, that converts raw flourescence intensity
          into differential gene expression sigantures. The data at each stage of the pipeline
          are available. Please consult the table below for the different levels of data and
          follow the steps here to <a href="http://download.lincscloud.org">download the data</a>.
        </p>
        <h3>Data Levels</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td>1</td>
            <td>LXB</td>
            <td>
              Raw, unprocessed flow cytometry data from Luminex scanners. One LXB file is
              generated for each well of a 384-well plate, and each file contains a
              fluorescence intensity value for every observed analyte in the well
            </td>
            </tr>
            <tr>
              <td>2</td>
              <td>GEX</td>
              <td>
                Gene expression values per 1,000 genes after de-convolution from Luminex beads
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Q2NORM</td>
              <td>
                Gene expression profiles of both directly measured landmark transcripts
                plus imputed genes. Normalized using invariant set scaling followed by
                quantile normalization
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>z-scores</td>
              <td>
                Signatures with differentially expressed genes computed by robust z-scores
                for each profile relative to population control
              </td>
            </tr>
          </tbody>
        </table>
        <h3>References</h3>
        <ol>
          <li>
            A description of the L1000 assay is being readied for publication.
            Please <a href="mailto:clue@broadinstitute.org">email us</a> if you have questions.
          </li>
          <li>
            Initial use of Luminex to readout mRNA expression levels: Peck D et. al A method for
            high-throughput gene expression signature analysis. Genome Biology. 2006/7/19. 7(7),
            (2006). <a href="scientific_publications/gb-2006-7-7-r61.pdf">Download paper</a>.
          </li>
        </ol>
        <h3>Assay Protocols</h3>
        <ul>
          <li><a href="http://amp.pharm.mssm.edu/static/L1000/L1000_SOP.pdf">L1000 SOP</a></li>
        </ul>
      </div>
    );
  }
}

export default AboutView;
