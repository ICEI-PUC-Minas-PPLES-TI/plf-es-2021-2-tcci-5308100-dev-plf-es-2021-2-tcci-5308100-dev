import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { SocialMedia } from '@Models/SocialMedia.entity';
import axios from 'axios';
import { PostService } from '../post/post.service';
import { PostStatus, SocialMediaName } from '@sec/common';

@Injectable()
export class SocialMediaService extends BaseService<SocialMedia> {
  constructor(
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
    private readonly postService: PostService,
  ) {
    super(socialMediaRepository, []);
    this.socialMediaRepository = socialMediaRepository;
  }

  public async fetchPostsByHashtags(
    {
      q,
      networks,
    }: {
      q: string[];
      networks: string[];
    },
    {
      limit = 20,
      page,
      requestid,
    }: { limit?: number } & (
      | { page?: undefined; requestid?: undefined }
      | { page: number; requestid: string }
    ) = {},
  ) {
    if (limit < 0 || limit > 100) return undefined;

    try {
      const { data } = await axios.get(
        'https://api.social-searcher.com/v2/search',
        {
          params: {
            q: q.join('OR'),
            lang: 'pt-BR',
            network: networks.join(','),
            limit: limit,
            page: page,
            requestid: requestid,
          },
        },
      );
      // const data: { posts: SocialSearcherPosts[] } = temp as any;

      if (data.posts) {
        const posts = await this.upsertPosts(data.posts);

        return posts;
      } else {
        return undefined;
      }
    } catch (error) {
      console.dir(error);
      return undefined;
    }
  }

  public async fetchPostsByAccount(
    {
      userId,
      networks,
    }: {
      userId: string;
      networks: string[];
    },
    {
      limit = 20,
      page,
      requestid,
    }: { limit: number } & (
      | { page: undefined; requestid: undefined }
      | { page: number; requestid: string }
    ),
  ) {
    if (limit < 0 || limit > 100) return undefined;

    try {
      const { data } = await axios.get(
        `https://api.social-searcher.com/v2/users/${userId}/posts`,
        {
          params: {
            lang: 'pt-BR',
            network: networks.join(','),
            limit: limit,
            page: page,
            requestid: requestid,
          },
        },
      );
      // const data = temp;

      if (data.posts) {
        const posts = await this.upsertPosts(data.posts);

        return posts;
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  public async searchUsersByName(accountName: string, networks: string[]) {
    try {
      console.log('fetchPosts-accountName: ', accountName);
      console.log('fetchPosts-networks: ', networks.join(','));
      return undefined;

      const { data } = await axios.get(
        'https://api.social-searcher.com/v2/users',
        {
          params: {
            q: accountName,
            network: networks.join(','),
          },
        },
      );

      return data;
    } catch (error) {
      return undefined;
    }
  }

  private async upsertPosts(posts: SocialSearcherPosts[]) {
    const [instagram, twitter] = await Promise.all([
      this.findOne({ name: SocialMediaName.INSTAGRAM }),
      this.findOne({ name: SocialMediaName.TWITTER }),
    ]);

    const socialMedias = {
      instagram,
      twitter,
    };

    const postsSaved = await this.postService.getRepository().upsert(
      posts.map((post) => ({
        token: post.postid,
        status: PostStatus.UNDER_REVIEW,
        url: post.url,
        socialMedia: socialMedias[post.network].id,
      })),
      { conflictPaths: ['token'], skipUpdateIfNoValuesChanged: true },
    );

    return postsSaved;
  }
}

type SocialSearcherPosts = {
  network: string;
  posted: string;
  postid: string;
  text: string;
  type: string;
  sentiment: string;
  image: string;
  url: string;
  user: {
    userid: string;
  };
};

const temp = {
  meta: {
    requestid: '4d3262f9475043b084d8ce2d6b1057fd',
    http_code: 200,
    network: 'instagram',
    query_type: 'realtime',
    limit: 20,
    page: 0,
  },
  posts: [
    {
      network: 'instagram',
      posted: '2022-04-27 22:18:59 +00000',
      postid: '2825936799395682641',
      text: 'Ganhe para Divulgar no Instagram  Faça 3 posts por dia e ganhe R$1.520,00 por mês [Ganho mínimo] Vou te chamar no Whatsapp. 👇seu Whatsapp👇👇👇  #curso #o #cursos #cursoonline #a #n #brasil #online #cursosonline #s #taller #arte #aprender #empreendedorismo #escola #marketing #makeup #marketingdigit...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279219871_1463832537383212_4906888624797486367_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=vYw9ksVhtNAAX_E6wMB&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT-I2vfjKOex779gKfzurGnZNwxg2zMyAORoxvTv5HG50g&oe=62701184&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vovtrxlR',
      user: {
        userid: '425578391',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:18:52 +00000',
      postid: '2825936738587668231',
      text: '#caroloportunidades #vagascuiaba #empregoscuiaba #vagasvarzeagrande #empregosvarzeagrande #cuiaba #cuiabamt #matogrosso #trabalheconosco #destakcuiaba #job #recursoshumanos #empregoscuiabamt #vagasdeestagio #estagio #ufmt #univag #trabalho #unic #work #cuiabrasa #aprendiz #vagasdeaprendiz #trainee #...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-2.fna.fbcdn.net/v/t51.2885-15/279187261_691014102236377_3441874509291102725_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fbho4-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=1WtFzUKzMGwAX_n6Eyz&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT96Z-4GSJBqKwvrN9J4_DtbdZpBXijxVHTPScYkVBaWJQ&oe=626FC0E0&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vn3FPm8H',
      user: {
        userid: '44041198143',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:18:45 +00000',
      postid: '2825936675227668711',
      text: 'As Costelas de Adão, da boa sorte! 🍃✨🙌🏻 . . Maiô @dleonmodapraias  📸 @carolspanholifotografia  . . . . . . . #foto #trabalho #biquini #explorar #beleza #natureza #job #modelo',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-2.fna.fbcdn.net/v/t51.2885-15/279275421_572325887316250_629316435404279922_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fbho4-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=-lKbbTU6Uf4AX_oYpuN&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT8L-M_pYb748VKU2cNhokAWW7-ZsBf-x01CqwC-PQeVOQ&oe=62709800&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vm8EsZDn',
      user: {
        userid: '479266103',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:18:12 +00000',
      postid: '2825936404066469530',
      text: "I didn't change, I just found myself.💙(Eu não mudei,eu apenas me encontrei).  #fotografia #viral #viralpost #tarde #tardezinha #senac #cursos #poa #tumblr #trabalho #centrohistorico #centrohistórico #lookdodia #look #lookinspiração #blog #figura #sol #publica #figurapublica #skala #💙 #seda #dove #...",
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-2.fna.fbcdn.net/v/t51.2885-15/279418483_827821411943373_1036068971396471234_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-2.fna.fbcdn.net&_nc_cat=109&_nc_ohc=ZFchLKuqttMAX9C9Roa&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT-r95CFR9cLUGKU8sR969i1MLj1DDZVIAVa-zCq2ZeUzw&oe=6270BAB4&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vi_iOgaa',
      user: {
        userid: '21887497906',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:17:51 +00000',
      postid: '2825936227167532162',
      text: 'Faça sua simulação 📢 Atenção⚠️ Vc que possui FGTS✅  11 98873-2688 -Priscila Mazali  🔗na BIO  #fgts2022  #fgts  #simulação  #fgtsemergencial  #fgtsconsulta  #fgtsesaqueaniversario  #fgtsnamão  #fgts2022saqueaniversário  #saquefgts  #saiadosufocofinanceiro  #trabalhadores  #trabalhodigital  #trabalh...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-2.fna.fbcdn.net/v/t51.2885-15/279271211_164057579355145_5499095339902286764_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=BP8RJu-A4UMAX9oEwmJ&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT8oo-xcznNPHxq9CsE-ohK_vJeVrs6rOjaQ65W-qXj9XA&oe=627150B2&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vgayOnSC',
      user: {
        userid: '50698518562',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:17:32 +00000',
      postid: '2825936067598648983',
      text: "O conhecimento vale mais q 💰💸 let's go . . . . . . . . . . . .  #bodybuilding #ysmylife #upfit #teamcentral #campeonatobrasileiro #gilbertoteam #gratidão #npc #ifbbminas #musclecontest #ifbbpro #dieta #treino #foco #fe #trabalho #duro #fitness #harcore #evolucao #evolution #bodybuilder #bodyfitnes...",
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279236339_169589802130872_6195334613128298645_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=nA5-2e6dTEEAX_YyKUQ&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT9bqB260U_809xzRF9lggq2mX684e0mXBxYCTlHrxs3vQ&oe=62714294&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3veGLLoaX',
      user: {
        userid: '1558468918',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:17:03 +00000',
      postid: '2825935819028492993',
      text: '#caroloportunidades #vagascuiaba #empregoscuiaba #vagasvarzeagrande #empregosvarzeagrande #cuiaba #cuiabamt #matogrosso #trabalheconosco #destakcuiaba #job #recursoshumanos #empregoscuiabamt #vagasdeestagio #estagio #ufmt #univag #trabalho #unic #work #cuiabrasa #aprendiz #vagasdeaprendiz #trainee #...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279177130_669786450749165_5663616198307152_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=SaVnOab6d-8AX-MQeVz&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT9rw6RoIwDgeQ25VML2mGopao4B2K2GdUmITwZEtV7DAQ&oe=62710717&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vaerPvLB',
      user: {
        userid: '44041198143',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:15:52 +00000',
      postid: '2825935225467317740',
      text: '#caroloportunidades #vagascuiaba #empregoscuiaba #vagasvarzeagrande #empregosvarzeagrande #cuiaba #cuiabamt #matogrosso #trabalheconosco #destakcuiaba #job #recursoshumanos #empregoscuiabamt #vagasdeestagio #estagio #ufmt #univag #trabalho #unic #work #cuiabrasa #aprendiz #vagasdeaprendiz #trainee #...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279202139_1186788442059256_5861960874872727237_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=OjIgkhzDSG4AX97AFWm&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT-WVqLWSTX2Lx9PMxJK6Tp_mRdYnAb9RH-NcD068qjO8g&oe=6270B47A&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vR14Pi3s',
      user: {
        userid: '44041198143',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:14:27 +00000',
      postid: '2825934510380445657',
      text: '#caroloportunidades #vagascuiaba #empregoscuiaba #vagasvarzeagrande #empregosvarzeagrande #cuiaba #cuiabamt #matogrosso #trabalheconosco #destakcuiaba #job #recursoshumanos #empregoscuiabamt #vagasdeestagio #estagio #ufmt #univag #trabalho #unic #work #cuiabrasa #aprendiz #vagasdeaprendiz #trainee #...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279198910_163412396105654_929864386683471070_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=xVmaG6vod1YAX-Ldbzb&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT8JW0s73_GOH-h3cY1mIx4nGO7P0VGCVCndtTQS75Rmvg&oe=6270827F&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3vHb5vm_Z',
      user: {
        userid: '44041198143',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:13:10 +00000',
      postid: '2825933866394682344',
      text: 'A hora do bronze 😌 . . . . . . . . . . #trabalho #work #zonaoeste #zo #zoms  #rj  #brasil #vilaalianca #comunicacao #sustentabilidade  #rua  #vencendo #life #obrigadoDeus #gratidao #sol #followme #sdv #followforfollowback #instagood #photooftheday #hashtagsbrasil #follow #like4like #friends #instad...',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279274357_667696101122631_391874425357512311_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=t-OnxA3YzuUAX8jpWY3&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT_j7K4NDE9yrzmIKVF7Cf_ZuMR9Fwvs2j2fbTQkbjVPhg&oe=62701E27&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3u-EJM4Po',
      user: {
        userid: '50463128073',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 22:01:43 +00000',
      postid: '2825928108764106699',
      text: '#netflixbrasil #netflix #serie #séries #miniserie #ator #atores #sp #filmes #filmagem #gravação #trabalho #redeglobo #recordtv #redetv #sbt #band #saopaulo #novela #novelas #anuncios #atriz #atrizes #grisalho #elegante #elegancia #smoking #terno #classe #petropolis',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279195718_512140883715102_2900024877979112375_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=WHRW3fdxEmoAX-PSTC4&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT-SemZKCIIpayCPSHPGB5jN--bgipKrIVdD_b5yjoHlhg&oe=6270B10A&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3tqR7rQ_L',
      user: {
        userid: '1996709539',
      },
    },
    {
      network: 'instagram',
      posted: '2022-04-27 21:04:34 +00000',
      postid: '2825899339371498225',
      text: 'Hoje minha tarde foi assim....... 😉💪⚖  #advocaciaporamor  #ruasestrellaadvocaciaeconsultoria #trabalho#lutasevitórias',
      type: 'photo',
      sentiment: 'neutral',
      image:
        'https://instagram.fbho4-1.fna.fbcdn.net/v/t51.2885-15/279287287_530555248622151_8672004477601016322_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fbho4-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=IVUiJVQmKaUAX_gcOHG&edm=ABZsPhsBAAAA&ccb=7-4&oh=00_AT-J27XIVmZetRNlKF8QZ5JIxopW0jcZzU8jjFf_9CnBXQ&oe=62705566&_nc_sid=4efc9f',
      url: 'https://www.instagram.com/p/Cc3nHoWP8rx',
      user: {
        userid: '473004520',
      },
    },
  ],
};
