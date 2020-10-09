import {
  defaultOptions,
  defaultPieces,
  defaultMinimumApi as BasicApi,
  WriteAwayCore,
  IPieceItemState, IOptions,
} from '@writeaway/core';
import 'style.less';
import { RedaxtorSeoData, WriteAwaySeo } from '@writeaway/plugin-seo';
import { WriteAwayCodeMirror } from '@writeaway/plugin-codemirror';
import { WriteAwayBackground, WriteAwayImageTag, WriteAwayMedium } from '@writeaway/plugin-medium';
import { getCookie, setCookie } from 'persist';

const imageListBg = require('api/imagesBg');
const imageList = require('api/images');

export const components = {
  html: WriteAwayMedium,
  image: WriteAwayImageTag,
  background: WriteAwayBackground,
  source: WriteAwayCodeMirror,
  seo: WriteAwaySeo,
};

class WriteAwaySampleBundle extends WriteAwayCore {
  /**
   * Attaches invisible div handling SEO editing
   */
  attachSeo(data: Partial<RedaxtorSeoData>) {
    setTimeout(() => {
      const div = document.createElement('div');

      div.innerHTML = 'Edit SEO Meta';
      div.className = 'edit-seo-div';
      div.style.display = 'none';
      this.addPiece<RedaxtorSeoData>(div, {
        id: 'seo',
        name: 'Edit SEO',
        type: 'seo',
        data: {
          header: data?.header || '',
          title: data?.title || document.querySelector('title')?.innerHTML || '',
          description: data?.description || document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          keywords: data?.keywords || document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        },
      });
      document.querySelector('body')!.appendChild(div);
    });
  }

  constructor(options: IOptions) {
    WriteAwaySampleBundle.checkHtmlPiecesCompartibility(document);
    super(options);

    this.setEditorActive(getCookie('r_editorActive') === 'true');
    this.setNavBarCollapsed(getCookie('r_navBarCollapsed') === 'true');

    window.addEventListener('beforeunload', this.beforeUnload.bind(this));
  }

  beforeUnload() {
    setCookie('r_editorActive', this.isEditorActive() ? 'true' : '');
    setCookie('r_navBarCollapsed', this.isNavBarCollapsed() ? 'true' : '');
  }

  /**
   * Scans html pieces for invalid internal html and reverts them to source editor if needed
   */
  static checkHtmlPiecesCompartibility(node: Element | Document) {
    /**
     * In Spiral html pieces are marked up as data-piece="html", collect them
     */
    const pieces = node.querySelectorAll('[data-piece="html"]');
    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      if (piece.querySelector('iframe')) {
        // We have invalid piece data, fallback to source
        piece.setAttribute('data-piece', 'source');
      }
      if (piece.querySelector('script')) {
        // Script is not expected to be editable at the moment
        piece.setAttribute('data-piece', 'source');
        piece.setAttribute('data-nonupdateable', '1');
      }
    }
  }
}

const writeaway = new WriteAwaySampleBundle({
  ...defaultOptions,
  piecesOptions: {
    ...defaultPieces,
    components,
  },
  options: {
    html: {
      pickerColors: [
        'inherit',
        '#9b59b6',
        '#34495e',
        '#16a085',
        '#27ae60',
        '#2980b9',
        '#8e44ad',
        '#2c3e50',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#bdc3c7',
        '#95a5a6',
        '#666',
        '#212121',
        '#f39c12',
        '#d2d064',
        '#4fbbf7',
        '#ffffff',
      ],
    },
  },
  api: {
    ...BasicApi,
    /* api for get gallery image list */
    getImageList: (data: any) => ((data && data.type === 'background') ? Promise.resolve(imageListBg.data.list) : Promise.resolve(imageList.data.list)),
    /* example of api for delete images */
    deleteImage: () => Promise.resolve(true),
    uploadImage: () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          src: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg',
          thumbnailSrc: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg',
          width: 680,
          height: 606,
          id: Date.now().toString(),
        });
      }, 1000);
    }),
    getPieceData(piece: IPieceItemState) {
      return BasicApi.getPieceData(piece, BasicApi.resolvers).then((p: IPieceItemState) => {
        if (p.id === 'pieceSource2') {
          // eslint-disable-next-line no-param-reassign
          p.data.updateNode = false;
        }
        return p;
      });
    },
    savePieceData(piece: IPieceItemState) {
      console.info('Saving to server', piece);
      if (piece.id === 'errorSample') {
        throw new Error('This is a sample error');
      }
      return Promise.resolve(piece);
    },
  },
  pieceNameGroupSeparator: ':',
});

writeaway.attachSeo({ header: '' });

export default writeaway;